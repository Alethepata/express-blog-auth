const path = require('path');
let posts = require('../db/posts.json');
const fs = require('fs');

const update = newPost => {
    const file = path.join(__dirname, '../db/posts.json');
    fs.writeFileSync(file, JSON.stringify(newPost));
    posts = newPost;
}

const deleteFile = fileName => {
    const file = path.join(__dirname, '../public/imgs/posts', fileName);
    fs.unlinkSync(file);
}

const createSlug = title => {
    const baseSlug = title.replace(' ', '-').toLowerCase().replace('/', '');
    const slugs = posts.map(post => post.slug);
    let counter = 1;
    let slug = baseSlug;
    while(slugs.includes(slug)){
        slug = `${baseSlug}-${counter}`;
        counter ++;
    }
    return slug;
}

const index = (req, res) => {
    res.format({
        html: () => {
            let html;
            posts.forEach(post => {
                html +=
                    `
                    <div class="container">
                        <div class="card" style="width: 18rem; border: 1px solid black; padding:20px">
                            <img src="/imgs/posts/${post.image}" style="width:100%" alt="${post.title}">
                            <div class="card-body">
                                <div class="card-title">
                                    <h3>${post.title}</h3>
                                </div>
                                <div class="card-text">
                                    <p>${post.content}</p>
                                    <div class="tags">
                    `
                
                post.tags.forEach(tag => html += `<span style="margin:2px">#${tag}</span>`);
                
                html +=
                `
                                </div>
                                </div>
                                <a href="/posts/${post.slug}">${post.title}</a>
                            </div>
                        </div>
                    </div>
                `
                
            })
            res.send(html);
    
        },
        json: () => {
            res.json(posts);
        }
    })
};

const show = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug);
    res.format({
        html: () => {
            let html;
            if (post) {
                html += `
                <div>
                   <h1>${post.title}</h1>
                   <img width="500" src="/imgs/posts/${post.image}" alt="${post.title}">
                   <p>${post.content}</p>
                   <ul>
                `;
                post.tags.forEach(tag => html += `<li>${tag}</li>`);
                html += '</ul></div>';
            } else {
                html += `
                <div>
                   <h1>Non trovato</h1>
                </div>`
            }
                
            res.send(html);
    
        },
        json: () => {
            if (post) {
                res.json(post);
            } else {
                res.status(404).json({
                    error: 'Not Found',
                    describe: `Non esiste una post ${slug}`
                });
            }
        }
    })
}
const store = (req, res) => { 
    const { title, content, tags } = req.body;

    if (!title || !content || !tags) {

        req.file?.filename && deleteFile(req.file.filename);
        return res.status(400).send('Manca qualcosa');

    } else if (!req.file || !req.file.mimetype.includes('image')) {
        
        req.file?.filename && deleteFile(req.file.filename);
        return res.status(400).send('Manca l\'immagine');

    }

    const slug = createSlug(title);

    const newPost = {
        title,
        content,
        tags,
        image: req.file.filename,
        slug

    }
    
    update([...posts, newPost]);

    res.format({
        html: () => {
            res.redirect(`/posts/${newPost.slug}`);
        },
        json: () => { 
            res.json(newPost);
        }
    })
}

const download = (req, res) => { 
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug);
    if (post) {
        const file = path.join(__dirname + '/../public/imgs/posts/' + post.image)
        res.download(file); 
    } else {
        res.send("<h1>Non esiste</h1>")
    }
}

const destroy = (req, res) => { 
    res.format({
        html: () => {
            res.redirect('/posts');
        },
        json: () => { 
            res.status(200).json({
                status: 200,
                message: 'Post cancellato con sucesso'
            });
        }
    })
}

module.exports = {
    index,
    show,
    store,
    download,
    destroy
}