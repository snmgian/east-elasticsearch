# east elasticsearch

Elasticsearch adapter for [east](https://github.com/okv/east) (node.js database migration tool).

All executed migrations names will be stored at `.migrations` index in elasticsearch.
A elasticsearch Client object will be passed to `migrate` and `rollback` functions, see
[elasticsearch-js](https://github.com/elastic/elasticsearch-js)


## Installation

```sh
npm install east east-elasticsearch -g
```

alternatively you could install it locally


## Usage

go to project dir and run

```sh
east init
```

create `.eastrc` file at current directory

```js
{
	"adapter": "east-elasticsearch",
	"url": "",
  "elasticSearchApiVersion": undefined,
  "migrationsIndex": ".migrations"
}
```

`url`: url for connect to elasticsearch: "localhost:9200"

`migrationsIndex`: _Optional_ name of the index at which the applied migrations will be tracked.

`elasticSearchApiVersion`: _Optional_ api version of your elasticsearch. See https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html


now we can create some migrations

```sh
east create apples
```

created file will look like this one

```js
exports.migrate = function(client, done) {
	done();
};

exports.rollback = function(client, done) {
	done();
};
```

edit created file and insert

```js
exports.migrate = function(client, done) {
  client.indices.create({ index: 'apples' }).then(() => {
    done();
  }).catch(done);
};

exports.rollback = function(client, done) {
  client.indices.create({ index: 'apples' }).then(() => {
    done();
  }).catch(done);
};
```

now we can execute our migrations

```sh
east migrate
```

output

```sh
target migrations:
	1_apples
migrate `1_apples`
migration done
```

and roll them back

```sh
east rollback
```

output

```sh
target migrations:
	1_apples
rollback `1_apples`
migration successfully rolled back
```

you can specify one or several particular migrations for migrate/rollback e.g.

```sh
east migrate 1_apples
```

or

Run `east -h` to see all commands, `east <command> -h` to see detail command help,
see also [east page](https://github.com/okv/east#usage) for command examples.


## Running tests

run [east](https://github.com/okv/east#running-test) tests with this adapter
