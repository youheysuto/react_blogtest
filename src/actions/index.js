import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder';

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    await dispatch(fetchPosts());
    // get posts in sent state
    // const userIds = _.uniq(_.map(getState().posts, 'userId'));
    // userIds.forEach(id => dispatch(fetchUser(id)));

    _.chain(getState().posts)
        .map('userId')
        .uniq()
        .forEach(id=>dispatch(fetchUser(id)))
        .value();

}

/*
* 1. async/await 構文を使用して外部APIを呼び出すと、最初にレスポンスオブジェクト(jsonPlaceholder.get('./posts'))を返してしまう
* 2. actionの戻り値は pureJSオブジェクトでなければいけないので、上記でエラーになる。
* 3. redux-thunk を用いると 関数( ()=> async(dispatch)~~ )を返すことができるようになるため、この中で async/awaitが使える
* ※ 自前で dispatch する必要あり
*/
export const fetchPosts = () => async dispatch => {
    const response = await jsonPlaceholder.get('./posts');
    dispatch({type: 'FETCH_POSTS', payload: response.data });
}

export const fetchUser = (id) => async dispatch => {
    const response = await jsonPlaceholder.get(`./users/${id}`)
    dispatch({type: 'FETCH_USER', payload: response.data });
}

// POSTの数だけUSERAPIが呼び出されてしまう対策 (user は全部で10人だけだが、一人10個投稿を持っているので100回リクエストが呼ばれる)

// 対策案１
// lodash.js を利用して、関数をキャッシュする
// ※ 引数(id,dispatch)で同一リクエストか判断している。
// export const fetchUser = id => dispatch => _fetchUser(id,dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//     const response = await jsonPlaceholder.get(`./users/${id}`);
//     dispatch({type: 'FETCH_USER', payload: response.data });
// });

// 対策案２
// fetchPostsAndUser
