import store from "../store"

export default function factory(reducer, path) {
    let action = (...args) => store.dispatch(path, reducer(...args, store.of(path)));
    action.path = path;
    return action;
}
