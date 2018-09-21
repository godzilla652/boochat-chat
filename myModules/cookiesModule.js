function randomSringMaker(){
  let charArray = [[48,57],[65,90],[97,122]]
  function random97122(){
    let random = randomInteger(4, 29) + 93
    return random
  }
  function randomInteger(min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    }

  //Main function
  this.makeString = function make_random_string(){
    let string = ''
    let amount = 34
    for(let i = 0; i < amount; i++){
      let random1 = randomInteger(48,57)
      let random2 = randomInteger(65,90)
      let random3 = random97122()

      let arrayOfRandoms = [random1,random2,random3]
      let random = randomInteger(0, 2);
      let result = String.fromCharCode(arrayOfRandoms[random])

      string += result
    }
    return string
  }
}



module.exports = new randomSringMaker()
