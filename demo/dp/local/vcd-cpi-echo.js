// var://service/URI	string	'/?name=John'
const sm = require('service-metadata');
const uri = sm.URI;
const name = uri.substr(uri.indexOf('name=') + 'name='.length)
// var://service/client-service-address	string	'10.0.16.84:52338'
const client_host_port = sm.clientServiceAddress;
session.output.write({"msg": "Hello", "name": name, "client": client_host_port});
