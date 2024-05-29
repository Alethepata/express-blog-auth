const notFound = (req, res, next) => {
    res.format({
        html: () => {
            res.status(404).send('<h1>Pagina non trovata</h1>')
        },
        json: () => {
            res.status(404).json({
            status: 404,
            error: 'Pagina non trovata',
            })
        }
    })
}
const serverError = (err, req, res, next) => {
    res.format({
        html: () => {
            res.status(500).send(`<h1>${err.message}</h1>`)
        },
        json: () => {
            res.status(500).json({
            status: 500,
            error: err.message,
            })
        }
    })
}
module.exports = {
    notFound,
    serverError
}

