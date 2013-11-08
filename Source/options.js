
var defaultRules = [
  {from:'the cloud', to:'my butt'},
  {from:'cloud', to:'butt'}
]


function parseRules(includeRegExp) {
  var ruleElements = document.querySelector('#rules').children
  var status = document.getElementById("status")
  var rule, rules = []

  for (var i = 0; i < ruleElements.length; i++) {
    rule = {
      from:   ruleElements[i].querySelector('input.from').value,
      to:     ruleElements[i].querySelector('input.to').value
    }
    if (!rule.to || !rule.from) continue
    rules.push(includeRegExp ? ruleToRegExp(rule) : rule)
  }
  console.log(rules)
  return rules
}

function ruleToRegExp(rule) {
  var lc, sc, tc, words, word

  lc = rule.to.toLowerCase()
  sc = lc.substring(0,1).toUpperCase() + lc.substring(1)
  tc = []
  words = lc.split(' ')
  while (words.length) {
    word = words.shift()
    tc.push(word.substring(0,1).toUpperCase() + word.substring(1))
  }

  rule.replace = {
    from: new RegExp(rule.from, 'gi'),
    to: {
      lc: lc,
      sc: sc,
      tc: tc.join(' ')
    }
  }
  return rule
}

function addRule() {
  render(parseRules().concat({to:'', from:''}))
}

function render(rules) {
  var html = ''
  var rulesElement = document.querySelector('#rules')

  for (var i = 0; i < rules.length; i++) {
    html += '<li class="rule">' +
      '<label>Replace</label> <input class="from" placeholder="Cloud" type="text" value="'+rules[i].from+'"/>' +
      '<label>with</label> <input class="to" placeholder="Butt" type="text" value="'+rules[i].to+'"/>' +
      '<button class="remove">x</button>' +
    '</li>'
  }
  rulesElement.innerHTML = html
}

function removeRule(e) {
  if (e.target.className !== 'remove') return
  e.target.parentNode.remove()
}

function resetRules() {
  render(defaultRules)
  saveOptions()
}

// Save options to storage
function saveOptions() {
  var status = document.getElementById('status')
  chrome.storage.sync.set({rules: parseRules(true)}, function() {
    status.innerHTML = "Options Saved."
    setTimeout(function() {
      status.innerHTML = ""
    }, 1000)
  })
}

// Get options from storage
function restoreOptions() {
  chrome.storage.sync.get('rules', function(data) {
    render(data.rules || defaultRules)
  })
}

// Event Listeners
document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('#reset').addEventListener('click', resetRules)
document.querySelector('#save').addEventListener('click', saveOptions)
document.querySelector('#add').addEventListener('click', addRule)
document.querySelector('#rules').addEventListener('click', removeRule)


