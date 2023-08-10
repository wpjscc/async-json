## async json data structure


index.html 有大量的例子

## simple use


```
    var asyncJson = new window.AsyncJson

    asyncJson.registerDataSource('user', {
        id: 1,
        name: 'hello user',
    })

    asyncJson.getAsyncJson({
        user_id:':id',
        user_name:':user_name'
    }).then(res=>{
        console.log(res, JSON.stringify(res))
    }).catch(error => {
        console.error(error)
    })


```