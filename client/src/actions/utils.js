
export function objectifier(by) {
    return function(array) {
        return array.reduce((last, item) => {
            last[item[by]] = item;
            return last;
        }, {})
    }
}