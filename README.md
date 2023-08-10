## async json data structure

[https://github.com/wpjscc/async-json](https://github.com/wpjscc/async-json)

index.html 有大量的例子

想了解一些上下文信息的请看这几篇文章

* [json 里的value 如何从不同的上下文中取值](https://blog.wpjs.cc/blog/post/json-value-get-different-context-value)
* [json 里的value 如何从不同的上下文中取值-之promise](https://blog.wpjs.cc/blog/post/json-value-promise)


下面将列举一些例子，说明如何使用它。


## simple use


```
    var asyncJson = new window.AsyncJson

    // 数字
    asyncJson.registerDataSource('number', 1)
    // 字符串
    asyncJson.registerDataSource('string', 'hello world')
    // 对象
    asyncJson.registerDataSource('obj', {
        number: 1,
        string: 'hello world',
    })

    // 数组
    asyncJson.registerDataSource('array', [
        {
            number: 1,
            string: 'hello world',
        },
        {
            number: 2,
            string: 'hello world2',
        }
    ])

    asyncJson.getAsyncJson({
       number: ':number',
        number_source: {
            _data_source: 'number',
        },

        string: ':string',
        string_source: {
            _data_source: 'string',
        },

        obj: ':obj',
        obj_source: {
            _data_source: 'obj',
        },

        array: ':array',
        array_source: {
            _data_source: 'array',
        },

    }).then(res=>{
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })


```

ouput

```
{
    "number": 1,
    "number_source": 1,
    "string": "hello world",
    "string_source": "hello world",
    "obj": {
        "number": 1,
        "string": "hello world"
    },
    "obj_source": {
        "number": 1,
        "string": "hello world"
    },
    "array": [
        {
            "number": 1,
            "string": "hello world"
        },
        {
            "number": 2,
            "string": "hello world2"
        }
    ],
    "array_source": [
        {
            "number": 1,
            "string": "hello world"
        },
        {
            "number": 2,
            "string": "hello world2"
        }
    ]
}
```

## 高级使用

```
    var asyncJson = new window.AsyncJson

    asyncJson.registerDataSource('user', {
        id: 1,
        name: 'hello user',
    })

    asyncJson.registerDataSource('post', {
        id: 2,
        title: 'hello post'
    })

    asyncJson.registerDataSource('user_post', {
        _data_source: 'user',
        _data_structure: 'user_post',
    })


    asyncJson.registerDataStructure('id', ":id")
    asyncJson.registerDataStructure('name', ":name")
    asyncJson.registerDataStructure('title', ":title")

    asyncJson.registerDataStructure('user', {
        id: ':id',
        name: ':name'
    })

     asyncJson.registerDataStructure('user_structure', {
        id: {
            _data_structure: 'id',
        },
        name: {
            _data_structure: 'name'
        }
    })

    asyncJson.registerDataStructure('post', {
        id: ':id',
        title: ':title'
    })

    asyncJson.registerDataStructure('user_post', {
        id: ':id',
        name: ':name',
        post: {
            _data_source: 'post',
            _data_structure: {
                id: ':id',
                title: ':title'
            }
        }
    })

    asyncJson.getAsyncJson({
        user: ':user',
        user_structure: {
            _data_source:'user',
            _data_structure: 'user_structure',
        },
        user_structure_custome: {
            _data_source:'user',
            _data_structure: {
                id: ':id',
                name: ':name',
            },
        },

        post: ':post',
        post_structure: {
            _data_source: 'post',
            _data_structure: 'post',
        },
        post_structure_custome: {
            _data_source:'post',
            _data_structure: {
                id: ':id',
                title: ':title',
            },
        },

        user_post: ':user_post',
        user_post_structure: {
            _data_source:'user_post',
            _data_structure: 'user_post',
        },
        user_post_custome: {
            _data_source:'user_post',
            _data_structure: {
                user_id: ':id',
                post_id: ':post.id'
            },
        },



    }).then(res=> {
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })


```

ouput
```
{
    "user": {
        "id": 1,
        "name": "hello user"
    },
    "user_structure": {
        "id": 1,
        "name": "hello user"
    },
    "user_structure_custome": {
        "id": 1,
        "name": "hello user"
    },
    "post": {
        "id": 2,
        "title": "hello post"
    },
    "post_structure": {
        "id": 2,
        "title": "hello post"
    },
    "post_structure_custome": {
        "id": 2,
        "title": "hello post"
    },
    "user_post": {
        "id": 1,
        "name": "hello user",
        "post": {
            "id": 2,
            "title": "hello post"
        }
    },
    "user_post_structure": {
        "id": 1,
        "name": "hello user",
        "post": {
            "id": 2,
            "title": "hello post"
        }
    },
    "user_post_custome": {
        "user_id": 1,
        "post_id": 2
    }
}
```

## promise

```
    var asyncJson = new window.AsyncJson
    asyncJson.registerDataSource('api', (config) => async () => await [{id:5},{id:6},{url: config._data_option.url}])
    asyncJson.getAsyncJson({
        api_data: {
            _data_source: 'api',
            _data_option: {
                url: '/api'
            }
        }
    }).then(res=> {
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })


```

ouput
```
{
    "api_data": [
        {
            "id": 5
        },
        {
            "id": 6
        },
        {
            "url": "/api"
        }
    ]
}
```

_data_option 可以动态替换掉参数（替换掉的是父上下文中的数据）


```
    var asyncJson = new window.AsyncJson
    asyncJson.registerDataSource('user', {
        id: 1,
        name: 'hello user',
    })
    asyncJson.registerDataSource('api', (config) => async () => await [{id:5},{id:6},{url: config._data_option.url}])
    asyncJson.getAsyncJson({
        api_data: {
            _data_source: 'api',
            _data_option: {
                url: '/api/:user.id'
            }
        }
    }).then(res=> {
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })
```

output

```
{
    "api_data": [
        {
            "id": 5
        },
        {
            "id": 6
        },
        {
            "url": "/api/1"
        }
    ]
}
```


可以将 api_data 封装成一个数据源
```
    var asyncJson = new window.AsyncJson
    asyncJson.registerDataSource('user', {
        id: 1,
        name: 'hello user',
    })
    asyncJson.registerDataSource('api', (config) => async () => await [{id:5},{id:6},{url: config._data_option.url}])
    asyncJson.registerDataSource('api_data', {
        _data_source: 'api',
        _data_option: {
            url: '/api/:id'
        }
    })
    asyncJson.getAsyncJson({
        user: {
            _data_source: 'user',
            _data_structure: {
                id: ':id',
                api_data: {
                    _data_source: 'api_data'
                }
            }
        }
    }).then(res=> {
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })
```

output 

```
{
    "user": {
        "id": 1,
        "api_data": [
            {
                "id": 5
            },
            {
                "id": 6
            },
            {
                "url": "/api/1"
            }
        ]
    }
}
```

## 数据源组合

```
    var asyncJson = new window.AsyncJson

    asyncJson.registerDataSource('user', {
        id: 1,
        name: 'hello user',
    })

    asyncJson.registerDataSource('post', {
        id: 2,
        title: 'hello post'
    })
    asyncJson.registerDataSource('user_post', {
        _data_source: 'user',
        _data_structure: {
            id: ':id',
            post: {
                _data_source: 'post'
            }
        }

    })

    asyncJson.getAsyncJson({
        user_post: ':user_post',
        user_post1: {
            _data_source: 'user_post'
        },
        user_post2: {
            _data_source: 'user_post',
            _data_structure: {
                user_id: ':id',
                post: {
                    _data_source: ':post',
                    _data_structure: {
                        post_id: ':id',
                        post_title: ':title'
                    }
                }
            }
        },
    }).then(res=> {
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })


```

output

```
{
    "user_post": {
        "id": 1,
        "post": {
            "id": 2,
            "title": "hello post"
        }
    },
    "user_post1": {
        "id": 1,
        "post": {
            "id": 2,
            "title": "hello post"
        }
    },
    "user_post2": {
        "user_id": 1,
        "post": {
            "post_id": 2,
            "post_title": "hello post"
        }
    }
}
```

注意 下方的 `_data_source: ':post'` 中的 `:post` 当是冒号开头时，从父上下文寻找数据，即 user_post 中

```
user_post2: {
    _data_source: 'user_post',
    _data_structure: {
        user_id: ':id',
        post: {
            _data_source: ':post',
            _data_structure: {
                post_id: ':id',
                post_title: ':title'
            }
        }
    }
}
```


