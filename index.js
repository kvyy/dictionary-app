const searchForm = document.querySelector('form')
const searchInput = document.querySelector('input[type="text"]')

searchForm.addEventListener('submit', evt => {
  evt.preventDefault()

  if (searchInput.validity.valueMissing || !Boolean(searchInput.value.trim())) {
    searchForm.classList.add('invalid')

    searchInput.focus()
    searchInput.addEventListener(
      'input',
      evt => {
        searchForm.classList.remove('invalid')
      },
      { once: true }
    )

    return
  }

  search(searchInput.value)
  searchInput.blur()
})
async function search(word) {
  const { definitions, wordNotFound } = await fetchDefinitions(word)

  if (wordNotFound) {
    renderNotFoundTemplate(definitions)
  } else {
    renderDefinitions(definitions)
  }
}

async function fetchDefinitions(word) {
  const definitionsWrapper = document.querySelector('.definitions-wrapper')
  definitionsWrapper.innerHTML = 'Loading'

  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

  return {
    definitions: await response.json(),
    wordNotFound: !response.ok && response.status === 404
  }
}

const fontSelectCheckbox = document.querySelector('#font-select')
const currentFont = document.querySelector('#current-font')
const fontOptions = document.querySelector('#font-options')

const fontClasses = {
  'Sans Serif': 'font-inter',
  Serif: 'font-lora',
  Mono: 'font-inconsolata'
}

let currentFontClass = 'font-inter'

fontOptions.addEventListener('click', evt => {
  document.body.classList.remove(currentFontClass)
  currentFontClass = fontClasses[evt.target.innerText]
  currentFont.innerText = evt.target.innerText
  document.body.classList.add(currentFontClass)
  fontSelectCheckbox.checked = false
})

function renderDefinitions(searchResults) {
  const parsedDefinitions = parseSearchResults(searchResults)
  console.log(parsedDefinitions)

  const definitionsWrapper = document.querySelector('.definitions-wrapper')

  definitionsWrapper.innerHTML = `
    <div class="flex justify-between items-center mb-8 md:mb-10">
      <!--? Search word and phonetic -->
      <div class="flex flex-col">
        <h1 class="text-mheading-l md:text-heading-l font-bold mb-2">${parsedDefinitions.word}</h1>
        <h2 class="text-purple text-mheading-m md:text-heading-m">${
          parsedDefinitions.phonetic.text
        }</h2>
      </div> 

      <!--? Play button -->
      <button class="w-12 h-12 md:w-[75px] md:h-[75px]" onclick="this.firstElementChild.play()">
        <audio>
          <source src="${parsedDefinitions.phonetic.audio}" type="audio/mp3" />
        </audio>
        <img class="" src="./assets/images/play.svg" alt="" />
      </button>
    </div>

    <!--? Meaning Section -->
    ${parsedDefinitions.meanings
      .map(
        meaning =>
          `<div class="mb-8 md:mb-10">
          <!--? Part of speech and hr  -->
          <div class="flex gap-4 items-center mb-8 md:mb-10">
            <h2 class="text-mheading-m md:text-heading-m font-bold italic">
              ${meaning.partOfSpeech}
            </h2>
            <hr class="w-full border-t-gray-2 dark:border-t-black-4" />
          </div>

          <h3 class="text-mheading-s md:text-heading-s text-gray-1 mb-[17px] md:mb-[25px]">
            Meaning
          </h3>

          <!--? Definitions -->
          <div class="mb-6 md:mb-10">
            <ul class="text-mbody-m md:text-body-m pl-4 list-disc marker:text-purple">
            ${meaning.definitions
              .map(
                definition =>
                  `
                  <li class='pl-5 mb-[13px]'>
                    <p class='mb-[13px]'>${definition.definition}</p>
                    ${
                      definition.example !== undefined
                        ? `<p class='text-gray-1'>${definition.example}</p>`
                        : ''
                    }
                  </li>`
              )
              .join('')}
            </ul>
          </div>

          <!--? Synonyms -->
          ${
            meaning.synonyms.length
              ? `<div class="text-mheading-s md:text-heading-s">
                  <h3 class="inline-block text-gray-1">Synonyms</h3>
                  <span class="text-purple font-bold">${meaning.synonyms.join(', ')}</span>
                </div>`
              : ''
          }
          </div>`
      )
      .join('')}
  
    <hr class="border-t-gray-2 dark:border-t-black-4 mb-6 md:mb-[19px]" />
    
    <div class="text-mbody-s md:flex md:gap-5 md:items-baseline">
      <p class="text-gray-1 mb-2 md:mb-0 underline-offset-[3px]"><u>Source</u></p>
      <a class="underline underline-offset-[3px]" href="${
        parsedDefinitions.sourceURL
      }" target='_blank'>
        ${parsedDefinitions.sourceURL}<img
          class="inline-block ml-2 align-baseline"
          src="./assets/images/new-window.svg"
          alt=""/>
      </a>
    </div>
  `
}

function renderNotFoundTemplate(searchResults) {
  const definitionsWrapper = document.querySelector('.definitions-wrapper')

  definitionsWrapper.innerHTML = `
    <div class="text-center">
      <h1 class="text-heading-l mb-8">😕</h1>
      <h2 class="text-mheading-s md:text-heading-s font-bold mb-6">${searchResults.title}</h2>
      <p class="text-gray-1 text-mbody-m md:text-body-m">
        ${searchResults.message} ${searchResults.resolution}
      </p>
    </div>
  `
}

function parseSearchResults(searchResults) {
  const word = searchResults[0].word
  let phonetic = {}
  const meanings = []
  const sourceURL = searchResults[0].sourceUrls[0]

  for (let result of searchResults) {
    if (result.phonetics.length) {
      for (let p of result.phonetics) {
        if (p.text) {
          phonetic.text = p.text

          if (p.audio) {
            phonetic.audio = p.audio
            break
          }
        }
      }
    } else {
      phonetic.text = result.phonetic || ''
    }

    meanings.push(...result.meanings)
  }

  return { word, phonetic, meanings, sourceURL }
}
