var Parser = function(db) { 

  var db = db;

  var masterTraits = {
    //['funct', '+funct'], //function words. for testing.
    'posemo': '+posemo', //use cat names if they correspond!
    'negemo': '+negemo',
    // ['anger', '+anger'], 
    // ['i', '+i'], 
    // // ['we', '+we'], 
    // // ['complexity', '+excl+tentat+negate-incl+discrep'],
    // // ['status', '+we-i'],
    // // ['depression', '+i+bio+negemo-posemo'],
    // // ['formality', '-i+article+sixltr-present-discrep'],
    // ['honesty', '+i+excl-negemo'],
    // ['femininity', '+other+posemo+sixltr-negate-article-preps-swear-money-number'],
    'aggression': '+anger+swear'
  };



        //var traitModifier = msg['calcs'][0][1].substring(0,1);
  return {
  
    initialize: function() {
      // making two tables for LIWC because it's faster

      // load non-wild table if needed
      if (!db.tableExists('LIWC_words')) {
        db.createTable('LIWC_words', ['word', 'cats', 'wildcard']);
        //db.truncate('LIWC_words');
        for (var i=0; i<LIWC.length; i++) {
          if (LIWC[i]['word'])
            db.insertOrUpdate('LIWC_words', {word: LIWC[i]['word']}, {word: LIWC[i]['word'], wildcard: false, cats: LIWC[i]['cat']});
        }

        console.log('loaded nonwild '+LIWC.length);
        db.commit();
      }
      // then load wild table
      if (!db.tableExists('LIWC_words_wild')) {
        db.createTable('LIWC_words_wild', ['word', 'cats', 'wildcard']);
        //db.truncate('LIWC_words_wild');
        
        for (var i=0; i<LIWC_wild.length; i++) {
          if (LIWC_wild[i]['word'])
            db.insertOrUpdate('LIWC_words_wild', {word: LIWC_wild[i]['word']}, {word: LIWC_wild[i]['word'], wildcard: true, cats: LIWC_wild[i]['cat']});
        }
        console.log('loaded wild '+LIWC_wild.length);
        db.commit();  
      } 
    }, 
  
    parseItem: function(item) {
    
      console.log(item);
      var spaceRegEx = new RegExp(/\S{1,}/g);
      var wordRegEx = new RegExp(/[\w|@|#]{1,}/);
      
      //split input string with RegExo
      var itemCats = {};
      var tokens = item.match(spaceRegEx);

      for (i in tokens) {
        //If the element isn't the last in an array, it is a new word
        if (tokens[i] !== '') {
          var word = tokens[i].toString();
          var cats = this.getCats(word);
          for (var j=0; j<cats.length; j++) {
            var c = cats[j];
            if (!itemCats[c]) {
              itemCats[c] = 1;
            } else {
              itemCats[c] = itemCats[c] + 1;
            }
          }
        }
      }

      return this.calcTraits(itemCats);
    },
    
    getCats: function(w) {
      
      var cats = [];

      // check for regular match
      var res = db.query('LIWC_words', {word: w.toLowerCase()}); 
      if (res.length > 0) {
        cats = res[0].cats;
      }
      
      // check for wildcards
      else {
        res = db.query('LIWC_words_wild', function(row) {
          if(w.toLowerCase().indexOf(row.word) == 0)
            return true;
          else return false;
        });
        if (res.length > 0) {
          cats = res[0].cats;
        }
      }
      return cats;
    },

    calcTraits: function(itemCats) {
      var traits = {};
      //console.log(itemCats);
      for (emo in masterTraits) {

        var val = 0;

        var toks = masterTraits[emo].split(/([a-z]*)/g)
        for (var t=0; t < toks.length; t+=2) {
          var mod = toks[t];
          var trait = toks[t+1];
          if (mod !== '') {
            var v = itemCats[trait] || 0;
            if (mod === '-') v *= -1;
            val += v;
          }
        }
        traits[emo] = val;
      }
      //console.log(traits);
      return traits;
    }
  }
};



