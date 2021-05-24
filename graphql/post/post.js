const graphql = require("graphql");
const sqlite3 = require('sqlite3').verbose();

//create a database if no exists
const database = new sqlite3.Database("../micro-blog.db");

//create a table to insert post
const createPostTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ayakkabilar (
        id integer PRIMARY KEY,
        UrunAd text,
        Kategori text,
        UrunFoto text,
        UrunFiyat text,
        Aciklama text,
        UcretsizKargo integer DEFAULT 1,
        YeniUrun text DEFAULT "1",
        Numara integer DEFAULT 38)`;

    return database.run(query);
}

//call function to init the post table
createPostTable();

//creacte graphql post object
const ShoesType = new graphql.GraphQLObjectType({
    name: "Shoes",
    fields: {
        id: {type: graphql.GraphQLID},
        UrunAd: {type: graphql.GraphQLString},
        Kategori: {type: graphql.GraphQLString},
        UrunFoto: {type: graphql.GraphQLString},
        UrunFiyat: {type: graphql.GraphQLString},
        Aciklama: {type: graphql.GraphQLString},
        UcretsizKargo: {type: graphql.GraphQLInt},
        YeniUrun: {type: graphql.GraphQLInt},
        Numara: {type: graphql.GraphQLInt},
    }
});
// create a graphql query to select all and by id
var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        //first query to select all
        Shoes: {
            type: graphql.GraphQLList(ShoesType),
            resolve: (root, args, context, info) => {
                return new Promise((resolve, reject) => {
                    // raw SQLite query to select from table
                    database.all("SELECT * FROM ayakkabilar;", function (err, rows) {
                        if (err) {
                            reject([]);
                        }
                        resolve(rows);
                    });
                });
            }
        },
        //second query to select by id
        Shoe: {
            type: ShoesType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                }
            },
            resolve: (root, {id}, context, info) => {
                return new Promise((resolve, reject) => {

                    database.all("SELECT * FROM ayakkabilar WHERE id = (?);", [id], function (err, rows) {
                        if (err) {
                            reject(null);
                        }
                        resolve(rows[0]);
                    });
                });
            }
        }
    }
});
//mutation type is a type of object to modify data (INSERT,DELETE,UPDATE)
var mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //mutation for creacte
        createShoes: {
            //type of object to return after create in SQLite
            type: ShoesType,
            //argument of mutation creactePost to get from request
            args: {
                UrunAd: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                Kategori: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                UrunFoto: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                UrunFiyat: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                Aciklama: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                UcretsizKargo: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                YeniUrun: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                Numara: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                }
            },
            resolve: (root, {UrunAd, Kategori, UrunFoto, UrunFiyat, Aciklama, UcretsizKargo, YeniUrun, Numara}) => {
                return new Promise((resolve, reject) => {
                    //raw SQLite to insert a new post in post table
                    database.run('INSERT INTO ayakkabilar (UrunAd, Kategori, UrunFoto, UrunFiyat,Aciklama,UcretsizKargo,YeniUrun,Numara) ' +
                        'VALUES (?,?,?,?,?,?,?,?);',
                        [UrunAd, Kategori, UrunFoto, UrunFiyat, Aciklama, UcretsizKargo, YeniUrun, Numara], (err) => {
                            if (err) {
                                reject(err);
                            }
                            database.get("SELECT last_insert_rowid() as id", (err, row) => {
                                resolve({
                                    id: row["id"],
                                    UrunAd: UrunAd,
                                    Kategori: Kategori,
                                    UrunFoto: UrunFoto,
                                    UrunFiyat: UrunFiyat,
                                    Aciklama: Aciklama,
                                    UcretsizKargo: UcretsizKargo,
                                    YeniUrun: YeniUrun,
                                    Numara: Numara,
                                });
                            });
                        });
                })
            }
        },
        //mutation for update
        updateShoes: {
            //type of object to return afater update in SQLite
            type: graphql.GraphQLString,
            //argument of mutation creactePost to get from request
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                },
                UrunAd: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                Kategori: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                UrunFoto: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                Aciklama: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                UcretsizKargo: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                YeniUrun: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                Numara: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                }
            },
            resolve: (root, {id,UrunAd, Kategori, UrunFoto, UrunFiyat, Aciklama, UcretsizKargo, YeniUrun, Numara}) => {
                return new Promise((resolve, reject) => {
                    //raw SQLite to update a post in post table
                    database.run('UPDATE ayakkabilar SET UrunAd = (?), Kategori = (?), UrunFoto = (?), UrunFiyat = (?), Aciklama = (?) , UcretsizKargo = (?) , YeniUrun = (?), Numara = (?) ' +
                        ' WHERE id = (?);',
                        [UrunAd, Kategori, UrunFoto, UrunFiyat, Aciklama, UcretsizKargo, YeniUrun, Numara,id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(`Ayakkabı #${id} updated`);
                    });
                })
            }
        },
        //mutation for update
        deleteShoes: {
            //type of object resturn after delete in SQLite
            type: graphql.GraphQLString,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                }
            },
            resolve: (root, {id}) => {
                return new Promise((resolve, reject) => {
                    //raw query to delete from post table by id
                    database.run('DELETE from ayakkabilar WHERE id =(?);', [id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(`Ayakkabı #${id} deleted`);
                    });
                })
            }
        }
    }
});

//define schema with post object, queries, and mustation
const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

//export schema to use on index.js
module.exports = {
    schema
}
