'use strict';

require('dotenv').config()

const config = {
    host: process.env.AS400_HOST,
    user: process.env.AS400_USERNAME,
    password: process.env.AS400_PASSWORD,
	naming: 'sql'
};

const xlst = require('xslt4node');

const as400 = require('node-jt400');
const pool = as400.pool(config);

const getSql = async () => {
	try {
		const data = await pool.query('SELECT CURRENT_TIMESTAMP FROM SYSIBM.SYSDUMMY1')
		return data;
	}
	catch (err) {
		throw err;
	}
};

const transformFoods = async () => {
	return new Promise((resolve, reject) => {
		const config = {
			xsltPath: 'select.xslt',
			sourcePath: 'catalog.xml',
			result: String,
		};
		
		xlst.transform(config, function (err, result) {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	})

};

const test = async () => {
	try {
		const data = await getSql();
		const transformed = await transformFoods();
		const results = {
			data,
			transformed
		}
		console.log(results);
	}
	catch (err) {
		console.log(err);
	}
}

test();
