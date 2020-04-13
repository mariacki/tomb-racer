
const rnd = (start: number, end: number) => {        
    const random = Math.random();

    return start + Math.round((end -1) * random)
}

export default rnd;