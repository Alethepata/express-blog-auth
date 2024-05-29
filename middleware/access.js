const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (! authorization) {
        res.format({
            html: () => {
                res.send('Non hai i permessi');
            },
            json: () => {
                res.status(401).json({
                    status: 401,
                    message: 'Non hai i permessi'
                })
            }
        })
    }

    const token = authorization.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, err => {
        let message;
        if (err) {
            
            if (err.message == 'jwt malformed') {

                message = 'Autenticazione non valida';

            } else if (err.message == 'jwt expired') {
                
                message = 'Autenticazione scaduta';

            }

            res.format({
                html: () => {
                    res.send(message);
                },
                json: () => {
                    res.status(403).json({
                        status: 403,
                        message
                    })
                }
            })
        }
        next();
    });

}
