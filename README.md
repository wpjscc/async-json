## async json data structure


index.html 有大量的例子

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


    asyncJson.registerDataStructure('user', {
        id: ':id',
        name: ':name'
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
            _data_structure: 'user',
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