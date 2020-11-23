const convertToCelcius = (fern) =>{
    return (fern-32)*5/9;
}

const convertToFar = (celcius) =>{
    return (9*celcius)/5 + 32;
}

module.exports = {
    convertToCelcius,
    convertToFar
};
