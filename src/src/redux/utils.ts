// import {put, call} from 'redux-saga/effects';

// import {authActions} from './features/auth/slice';
// import {store} from './store';

// export function* callApi(func, ...params) {
//   const requestParams = [...params];
//   if (requestParams && requestParams.includes('noErrorMess')) {
//     params.pop();
//   }
//   const {data, error} = yield call(func, ...params);

//   if (error) {
//     if (error.code === 2109) {
//       return error;
//     }

//     if (
//       (error.type === 'http' && (error.code === 401 || error.code === 403)) || // Common error
//       (error.type === 'application' && error.code === 6)
//     ) {
//       yield put(authActions.logOut());
//       return;
//     }

//     if (requestParams && requestParams.includes('getError')) {
//       return error;
//     }

//     if (requestParams && !requestParams.includes('noErrorMess')) {
//       // yield put(Actions.showMessage(error.userMessage));
//       return;
//     }
//   }
//   return data;
// }

// /** Just for mobx state or call without sagas */
// export const callApiPure = async (func, ...params) => {
//   const requestParams = [...params];
//   if (requestParams && requestParams.includes('noErrorMess')) {
//     params.pop();
//   }
//   const {data, error} = await func(...params);

//   if (error) {
//     if (error.code === 2109) {
//       return error;
//     }

//     if (
//       (error.type === 'http' && (error.code === 401 || error.code === 403)) || // Common error
//       (error.type === 'application' && error.code === 6)
//     ) {
//       store.dispatch(authActions.logOut());
//       return;
//     }

//     if (requestParams && requestParams.includes('getError')) {
//       return error;
//     }

//     if (requestParams && !requestParams.includes('noErrorMess')) {
//       return;
//     }
//   }
//   return data;
// };
