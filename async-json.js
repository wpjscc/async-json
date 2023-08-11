;(function() {
    
    var test = {
        is_array: function (value) {
            if (typeof Array.isArray === 'function') {
                return Array.isArray(value)
            }
            return Object.prototype.toString.call(value) === '[object Array]'
        },
        is_object: function (value) {
            return Object.prototype.toString.call(value) === '[object Object]'
        },
        is_string: function (value) {
            return typeof value === 'string'
        },
        is_function: function (value) {
            return typeof value === 'function'
        },
        is_data_source: function (value) { 
            return this.is_object(value) && value._data_source && value._not_data_source !== true
        },
        is_data_structure: function (value) { 
            return this.is_object(value) && value._data_structure && value._not_data_structure !== true
        },
    }

    class AsyncJson {
        data_sources = {};
        data_options = {};
        data_structures = {};
        registerDataSource(key, value) {
            this.data_sources[key] = value;
        }
        registerDataOption(key, value) { 
            this.data_options[key] = value;
        }
        registerDataStructure(key, value) {
            this.data_structures[key] = value;
        }

        async getDataSources() {
            return this.data_sources
        }
        async getDataOptions() { 
            return this.data_options
        }
        async getDataStructures() {
            return this.data_structures
        }
        async getDataSource(config, current_context) {

            var _data_source = config._data_source

            if (!_data_source) { 
                return _data_source
            }

            // var is_test = false
            // if (_data_source == 'comments') {
            //     is_test = true
            // }

            // 从注册数源里获取
            if (test.is_string(_data_source)) {

                // 说明是从当前上下文中去值的
                if (_data_source.indexOf(':') > -1) {
                    _data_source = await this.replaceParam(_data_source, current_context)
                } else {
                    _data_source = this.data_sources[_data_source]

                    if (_data_source) {
                        if (test.is_function(_data_source)) {
                            do {
                                _data_source = await _data_source(config)
                            } while (test.is_function(_data_source));
                        }
                        if (test.is_data_source(_data_source)) {
                            _data_source = await this.getAsyncJson(JSON.parse(JSON.stringify(_data_source)), config._data_context ?  await this.getAsyncJson(config._data_context, current_context) : current_context)
                        }
                        // return _data_source
                    }
                }


            }
            
            // 数据源潜套
            else if (test.is_object(_data_source)) {

                if (test.is_data_source(_data_source)) {
                    _data_source = await this.getAsyncJson(JSON.parse(JSON.stringify(_data_source)), config._data_context ?  await this.getAsyncJson(config._data_context, current_context) : current_context)
                }
            }
            // 数据源潜套
            else if (test.is_array(_data_source)) { 
                _data_source = await Promise.all(_data_source.map(async item => await this.getAsyncJson(item, config._data_context ?  await this.getAsyncJson(config._data_context, current_context) : current_context)))
                console.log('getDataSource-array32132131232131', _data_source)
            }

            if (!_data_source) { 
                console.error('未找到数据源: ' + config._data_source)
            }

            return _data_source
        }

        async getDataOption(config, current_context) { 

            var _data_option = config._data_option

            if (!_data_option) {
                return _data_option
            }

            if (test.is_string(_data_option)) {
                if (_data_option.indexOf(':') > -1) {
                    _data_option  = this.getAsyncJson(_data_option, current_context)
                } else {
                    _data_option = this.data_options[config._data_option]
                    if (_data_option) {
                        if (test.is_function(_data_option)) {
                            do {
                                _data_option = await _data_option(_data_option)
                            } while (test.is_function(_data_option));
                        }
                        else if (test.is_object(_data_option) || test.is_array(_data_option)) {
                            _data_option = await this.getAsyncJson(JSON.parse(JSON.stringify(_data_option)), current_context)
                        }
                        else {
                            _data_option = await this.getAsyncJson(_data_option, current_context)
                        }
                    }
                }
               
            } else if (test.is_object(config._data_option) || test.is_array(config._data_option)) { 
                _data_option = await this.getAsyncJson(JSON.parse(JSON.stringify(config._data_option)), current_context)
            }


            if (!_data_option) { 
                console.error('未找到数据选项:' + config._data_option)
            }

            return _data_option



        }

        async getDataStructure(config) {
            // 可以是数组、对象，字符串

            var _data_structure = config._data_structure

            if (!_data_structure) { 
                // 默认 返回所有
                return _data_structure || ':*'
            }

            if (test.is_string(_data_structure)) {
                // 说明已经定义了结构
                if (_data_structure.indexOf(':') > -1) {
                    // return _data_structure
                } else {
                    // 去看下是否有数据结构定义
                    _data_structure = this.data_structures[config._data_structure]
                    if (_data_structure) {
                        if (test.is_function(_data_structure)) {
                            do {
                                _data_structure = await _data_structure(config)
                            } while (test.is_function(_data_structure));
                        }

                        if (test.is_object(_data_structure) || test.is_array(_data_structure)) {
                            _data_structure = JSON.parse(JSON.stringify(_data_structure))
                        }
                    }
                }
                
            } else if (test.is_object(config._data_structure) || test.is_array(config._data_structure)) { 
                _data_structure = JSON.parse(JSON.stringify(config._data_structure))
            }

            if (!_data_structure) { 
                console.error('未找到数据结构:' + config._data_structure)
            }

            return _data_structure

        }

        async getAsyncJson(params, current_data_source) {
            return await this.#replaceParams(params, current_data_source || this.data_sources)
        }

        async #replaceParams(params, current_data_source) {
            // if (test.is_function(current_data_source)) {
            //     do {
            //         current_data_source = await current_data_source()
            //     } while (test.is_function(current_data_source))
            //     // 看下是否是动态数据源
            //     if (test.is_data_source(current_data_source)) {
            //         // 把 data_sources 传进去,可以用data_sources也可以用自定义的(注意只能取静态值,动态值要以数据源的方式获取)
            //         current_data_source = await this.getAsyncJson(current_data_source)
            //     }

            // }

            if (test.is_array(params)) {
                params = await Promise.all(params.map(async param => await this.#replaceParams(param, current_data_source)))
            }
            else if (test.is_object(params)) {
                if (test.is_data_source(params)) {
                    // 把当前上下文的数据传递到options中，方便下一个数据源和数据结构使用
                    console.log('params._data_option-before:', params._data_option)
                    params._data_option = await this.getDataOption(params, current_data_source)
                    console.log('params._data_option-after', params._data_option)
                    // 说明是从当前上下文中去值的
                    // if (params._data_source.startsWith(':')) {
                    //     params = await this.#replaceParams(await this.getDataStructure(params), await this.replaceParam(params._data_source, current_data_source))
                    // } else {
                        params = await this.#replaceParams(await this.getDataStructure(params), await this.getDataSource(params, current_data_source))
                    // }
                }

                else if (test.is_data_structure(params)) { 
                    params = await this.#replaceParams(await this.getDataStructure(params), current_data_source)
                }
                
                else {
                    if (test.is_array(current_data_source)) {
                        params = await Promise.all(current_data_source.map(async item => await this.#replaceParams(JSON.parse(JSON.stringify(params)), item)))
                    } else {
                        await Promise.all(Object.keys(params).map(async key => params[key] = await this.#replaceParams(params[key], current_data_source)))
                    }
                }
            }
            else if (test.is_string(params)) {
                // if (current_data_source) {
                    try {
                        params = await this.replaceParam(params, current_data_source)

                        // 直接从数据源获取数据时,数据源是一个函数(直接使用冒号语法的情况)
                        if (test.is_function(params)) {
                            do {
                                params = await params()
                            } while (test.is_function(params));
                            if (test.is_data_source(params)) {
                                params = await this.getAsyncJson(params)
                            }
                        }
                        // 直接获取的是数据源的json对象
                        else if (test.is_data_source(params)) {
                            // params = await this.getAsyncJson(JSON.parse(JSON.stringify(params)))
                            params = await this.getAsyncJson(params)
                        }


                    } catch (error) {
                        console.error('replaceParam-error', params, current_data_source)
                    }
            }

            return params
        }

        async replaceParam(param, obj) {

            if (!test.is_string(param)) {
                return param
            }

            if (param.indexOf(':') < 0) {
                return param;
            }

            if (typeof obj === 'function') {
                obj = await obj()
            }

            if (param.startsWith(':') && this.countSubstring(param, ':') === 1) {
                if (param.slice(1) === '*') {
                    return obj
                }
                console.log('replaceParam', param, '->', data_get(obj, param.slice(1)))
                return data_get(obj, param.slice(1));
            }
            return param.replace(/:([\w\.]+)/g, function (match, key) {
                console.log('replaceParam', ':' + key, '->', data_get(obj, key))
                return data_get(obj, key) || '';
            });
        }
        countSubstring(str, subStr) {
            // 使用正则表达式查找子字符串，并使用g标志实现全局搜索
            const regex = new RegExp(subStr, 'g');
            // 使用match方法获取匹配到的子字符串数组
            const matches = str.match(regex);
            // 如果没有匹配到子字符串，返回0；否则返回数组的长度
            return matches ? matches.length : 0;
        }
    }


    function data_get(target, path, fallback) {
        let segments = Array.isArray(path) ? path : path.split('.');
        let [segment] = segments;

        let find = target;

        if (segment !== '*' && segments.length > 0) {
            if (find[segment] === null || typeof find[segment] === 'undefined') {
                find = typeof fallback === 'function' ? fallback() : fallback;
            }
            else {
                find = data_get(find[segment], segments.slice(1), fallback);
            }
        }

        else if (segment === '*') {
            const partial = segments.slice(path.indexOf('*') + 1, path.length);

            if (typeof find === 'object') {
                find = Object.keys(find).reduce((build, property) => ({
                    ...build,
                    [property]: data_get(find[property], partial, fallback)
                }),
                    {});
            }
            else {
                find = data_get(find, partial, fallback);
            }
        }


        /*-----------------------------------------------------------------------------
         |   Arrayable Requirements
         *-----------------------------------------------------------------------------
         |
         |   . All arrays are converted to objects
         |   . For Example
         |      #Code
         |        Code -> data_set({ list: ['one', 'two', 'three'], 'list.*', 'update', true });
         |
         |      #Input
         |         Input -> { list: ['one', 'two', 'three'] }
         |
         |      #During We Convert Arrays To "Indexed Objects"
         |         During -> { list: { '1': 'one', '2': 'two', '3': 'three' } }
         |
         |      #Before Output we convert "Indexed Objects" Back To Arrays
         |         From -> { list: { '1': 'update', '2': 'update', '3': 'update' } }
         |         Into -> { list: ['update', 'update', 'update'] }
         |
         |   . Arrays convert into "Indexed Objects", allowing for wildcard (*) capabilities
         |   . "Indexed Objects" are converted back into arrays before returning the updated target
         |
         */
        if (typeof find === 'object') {
            if (Object.prototype.toString.call(find) === '[object Array]') {
                if (find.length == 0) {
                    return find
                }
            }
            if (Object.keys(find).length > 0) {
                const isArrayTransformable = Object.keys(find).every(index => index.match(/^(0|[1-9][0-9]*)$/));

                return isArrayTransformable ? Object.values(find) : find;
            }
        } else {
            return find;
        }
    };

    window.AsyncJson =  AsyncJson;

})();