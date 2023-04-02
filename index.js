const searchForm = document.querySelector('form')
const searchInput = document.querySelector('input[type="text"]')
let currentWord = ''

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

  if (searchInput.value.trim() === currentWord) return

  search(searchInput.value)
  searchInput.blur()
  currentWord = searchInput.value.trim()
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
  if (evt.target.matches('li')) {
    document.body.classList.remove(currentFontClass)
    currentFontClass = fontClasses[evt.target.innerText]
    document.body.classList.add(currentFontClass)
    currentFont.innerText = evt.target.innerText
    fontSelectCheckbox.checked = false
  }
})

fontSelectCheckbox.addEventListener('change', () => {
  // console.log(fontSelectCheckbox.checked)
  if (fontSelectCheckbox.checked) {
    document.addEventListener(
      'click',
      evt => {
        console.log(evt.target)
        if (!evt.target.matches('.fc')) {
          fontSelectCheckbox.checked = false
        }
      },
      { once: true }
    )
  }
})

// document.addEventListener('click', evt => {
//   if (!evt.target.matches('#font-options')) {
//     fontSelectCheckbox.checked = false
//   }
// })

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
          parsedDefinitions.phonetic.text || ''
        }</h2>
      </div> 

      <!--? Play button -->
      ${
        parsedDefinitions.phonetic.audio
          ? `
      <button class="active:opacity-30" title="play" onclick="this.firstElementChild.play()">
        <audio>
          <source src="${parsedDefinitions.phonetic.audio}" type="audio/mp3" />
        </audio>
        <svg
          class="group w-12 h-12 md:w-auto md:h-auto"
          xmlns="http://www.w3.org/2000/svg"
          width="75"
          height="75"
          viewBox="0 0 75 75"
        >
          <g fill="#A445ED" fill-rule="evenodd">
            <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" class="group-hover:opacity-100" />
            <path d="M29 27v21l21-10.5z" class="group-hover:fill-white" />
          </g>
        </svg>
      </button>`
          : ''
      }
      
      
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

          <!-- Synonyms -->
          ${
            meaning.synonyms.length
              ? `<div class="text-mheading-s md:text-heading-s">
                  <h3 class="inline-block text-gray-1 mr-6">Synonyms</h3>
                  <span class="text-purple font-bold">${meaning.synonyms
                    .map(
                      s =>
                        `<span class="underline underline-offset-[3px] cursor-pointer hover:opacity-70" onclick="search('${s}'); searchInput.value = '${s}'">${s}</span>`
                    )
                    .join(', ')}</span>
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

  if (searchResults[0].phonetics.length) {
    for (let p of searchResults[0].phonetics) {
      phonetic.text = p.text

      if (p.audio) {
        phonetic.audio = p.audio
        break
      }
    }
  }

  for (let result of searchResults) {
    meanings.push(...result.meanings)
  }

  return { word, phonetic, meanings, sourceURL }
}
