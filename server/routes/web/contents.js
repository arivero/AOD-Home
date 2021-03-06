'use strict'

const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();

//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get(constants.API_URL_STATIC_CONTENT_INFO_OPEN_DATA, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_OPEN_DATA;
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" ' 
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText", cnt.target_url AS "targetUrl" ' 
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_INFO_OPEN_DATA + '/terms', function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_OPEN_DATA;
    let contentTitle = constants.STATIC_CONTENT_CONTENT_TITLE_TERM;
    
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" ' 
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText", cnt.target_url AS "targetUrl" ' 
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2  and cnt.title = $3 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle, contentTitle],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_INFO_APPS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_APPS;
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" '
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText" '
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: constants.SQL_RESULSET_FORMAT_JSON
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_INFO_EVENTS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_EVENTS;
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" '
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText", cnt.target_url AS "targetUrl" '
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: constants.SQL_RESULSET_FORMAT_JSON
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_INFO_COLLABORATION, function (req, res, next) {

});

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_DEVELOPERS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_TOOLS;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_DEVELOPERS;
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" '
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText", cnt.target_url AS "targetUrl" '
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: constants.SQL_RESULSET_FORMAT_JSON
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_APIS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_TOOLS;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_APIS;
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" '
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText", cnt.target_url AS "targetUrl" '
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: constants.SQL_RESULSET_FORMAT_JSON
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_SPARQL, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_TOOLS;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_SPARQL;
    const query = {
        text: 'SELECT sec.id AS "sectionId", sec.title AS "sectionTitle", sec.subtitle AS "sectionSubtitle" '
        + ', sec.description AS "sectionDescription", cnt.content_order AS "contentOrder" '
        + ', cnt.title AS "contentTitle", cnt.content AS "contentText", cnt.target_url AS "targetUrl" '
        + 'FROM manager.sections sec '
        + 'JOIN manager.static_contents cnt '
        + 'ON sec.id = cnt.id_section '
        + 'WHERE sec.title = $1 AND sec.subtitle = $2 '
        + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: constants.SQL_RESULSET_FORMAT_JSON
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_SPARQL_CLIENT, function (req, res, next) {
    try {
        logger.debug('Servicio: Petición SPARQL');
        let serviceBaseUrl = constants.SPARQL_API_BASE_URL;
        let serviceRequestUrl = serviceBaseUrl;
        if (req.query.graph) {
            serviceRequestUrl += constants.SPARQL_API_LINK_PARAM_GRAPH + encodeURIComponent(req.query.graph);
        }

        if (req.query.query) {
            serviceRequestUrl += constants.SPARQL_API_LINK_PARAM_QUERY + encodeURIComponent(req.query.query);
        }

        if (req.query.format) {
            serviceRequestUrl += constants.SPARQL_API_LINK_PARAM_FORMAT + encodeURIComponent(req.query.format);
        }

        if (req.query.timeout) {
            serviceRequestUrl += constants.SPARQL_API_LINK_PARAM_TIMEOUT + encodeURIComponent(req.query.timeout);
        }

        if (req.query.debug) {
            serviceRequestUrl += constants.SPARQL_API_LINK_PARAM_DEBUG + encodeURIComponent(req.query.debug);
        }

        logger.notice('URL de petición: ' + serviceRequestUrl);

        //Proxy checking
        let httpConf = null;
        if (constants.REQUESTS_NEED_PROXY == true) {
            logger.warning('Realizando petición a través de proxy');
            let httpProxyConf = proxy.getproxyOptions(serviceRequestUrl);
            httpConf = httpProxyConf;
        } else {
            httpConf = serviceRequestUrl;
        }

        http.get(httpConf, function (results) {
            var body = '';
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });

    } catch (error) {
        logger.error(error);
    }
});

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_SPARQL_GRAPHS, function (req, res, next) {
    try {
        logger.debug('Servicio: Petición SPARQL Obtener Grafos');
        let serviceBaseUrl = constants.SPARQL_API_BASE_URL;
        let serviceRequestUrl = serviceBaseUrl;

        serviceRequestUrl += constants.SPARQL_API_QUERY_URL_ALL_GRAPHS;

        logger.notice('URL de petición: ' + serviceRequestUrl);

        //Proxy checking
        let httpConf = null;
        if (constants.REQUESTS_NEED_PROXY == true) {
            logger.warning('Realizando petición a través de proxy');
            let httpProxyConf = proxy.getproxyOptions(serviceRequestUrl);
            httpConf = httpProxyConf;
        } else {
            httpConf = serviceRequestUrl;
        }

        http.get(httpConf, function (results) {
            var body = '';
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error(error);
    }
});

module.exports = router;