const { drawDiagram } = require('./diagram.js');

const modalButton = document.querySelector('.modal-launch');
if (modalButton) {
  modalButton.addEventListener('click', () => {
    const model = document.querySelector('.modal');
    model.classList.add('is-active');
  });
}

const modalCross = document.querySelector('.close-modal');
if (modalCross) {
  modalCross.addEventListener('click', () => {
    const model = document.querySelector('.modal');
    model.classList.remove('is-active');
  });
}

const lb = document.querySelector('.cd-loading-bar');
const ab = document.querySelector('.actions-block');

function changePage(url, bool) {
  const lb = document.querySelector('.cd-loading-bar');
  const ab = document.querySelector('.actions-block');

  ab.classList.add('page-is-changing');
  lb.classList.add('page-is-changing');

  lb.classList.remove('nonedisplay');

  setTimeout(() => loadNewContent(url, bool), 1000);
  setTimeout(() => {
    if (lb) lb.classList.toggle('nonedisplay');

    lb.classList.remove('page-is-changing');
  }, 2000);
}

function changeBackPage(url, bool) {
  const lb = document.querySelector('.cd-loading-bar');

  lb.classList.remove('page-is-changing');
  lb.classList.remove('nonedisplay');
  lb.classList.add('page-is-back-changing');

  setTimeout(() => loadMainContent(url, bool), 1000);
  setTimeout(() => {
    if (lb) lb.classList.toggle('nonedisplay');

    lb.classList.remove('page-is-back-changing');
  }, 2000);
}

async function loadNewContent(url, bool) {
  const newSectionName = `cd-${url.replace('.html', '')}`;

  window.section = document.createElement('div');
  // let cdlb = document.createElement('div');
  // cdlb.classList.add('cd-loading-bar');
  // cdlb.classList.add('page-is-changing');
  section.classList.add(newSectionName);
  section.innerHTML = await fetchHtmlAsText(url);

  // body.append(cdlb);

  document.querySelector('main').innerHTML =
  section.querySelector('main').innerHTML;
  // document.querySelector('main').append(section.querySelector('main'));

  // drawDiagram();

  const animElems = document.querySelectorAll('.to-menu-trans-anim');
  for (const ael of animElems) {
    ael.addEventListener('click', (event) => {
      event.preventDefault();
      const newPage = ael.getAttribute('href');
      changeBackPage(newPage, true);
    });
  }

  const scripts = section.querySelectorAll('main scr');
  if (scripts.length > 0) {
    for (const script of scripts) {
      console.log(script);
      const filename = script.getAttribute('src');
      if (url === './addrecord.html') {
        if (filename === './dbcontroller.js') {
          const scrquery = script.getAttribute('query');
          const db = require(filename);

          document.querySelector('.income-input').onchange =
          function () {
            document.querySelector('.real-income-input').value =
            document.querySelector('.income-input').value;
          };

          let dbdata = await db.DBController.getData(scrquery);
          const catSelector = document.querySelector('.select-cat');
          const subcatSelector = document.querySelector('.select-subcat');
          const serviceSelector = document.querySelector('.select-service');
          const incomeInput = document.querySelector('.income-input');
          const realIncomeInput = document.querySelector('.real-income-input');
          const dateInput = document.querySelector('.date-input');
          const dropOffInput = document.querySelector('.dropoff-input');

          for (const el of dbdata) {
            const option = document.createElement('option');
            option.innerText = el.Name;
            option.value = el.Id;
            catSelector.append(option);
          }

          const subcatSelectorChange = async () => {
            serviceSelector.innerHTML = '';
            console.log(subcatSelector.value);
            dbdata = await db.DBController
              .getData(`select * from Services where SubCategoryId 
              = ${subcatSelector.value}`);
            console.log(dbdata);
            for (const el of dbdata) {
              const option = document.createElement('option');
              option.innerText = el.Name;
              option.value = el.Id;
              serviceSelector.append(option);
            }
          };

          const catSelectorChange = async () => {
            subcatSelector.innerHTML = '';
            serviceSelector.innerHTML = '';
            dbdata = await db.DBController
              .getData(`select * from SubCategories where CategoryId
               = ${catSelector.value}`);
            for (const el of dbdata) {
              const option = document.createElement('option');
              option.innerText = el.Name;
              option.value = el.Id;
              subcatSelector.append(option);
            }
            subcatSelectorChange();
          };

          catSelectorChange();

          catSelector.onchange = catSelectorChange;
          subcatSelector.onchange = subcatSelectorChange;

          document.querySelector('.addrecord-button')
            .addEventListener('click', async () => {
              if (
                serviceSelector.value !== '' &&
                            incomeInput.value !== '' &&
                            !isNaN(parseInt(incomeInput.value)) &&
                            realIncomeInput.value !== '' &&
                            !isNaN(parseInt(realIncomeInput.value)) &&
                            dateInput.value !== ''
              ) {
                const nextid = await db.DBController
                  .getData('select top 1 Id from log order by Id desc');
                db.DBController.writeData(`INSERT INTO Log (Id, ServiceId,
                   RecordDate, Price, DropOff) VALUES (${(nextid[0].Id + 1)}, 
                   ${serviceSelector.value}, "${dateInput.value}", 
                   ${incomeInput.value}, ${dropOffInput.checked})`);
              }
            });
        } else {
          const file = require(filename);
          console.log(file);
          file.main();
        }
      } else if (filename === './diagram.js') {
        const file = require(filename);
        console.log(file);
        file.drawDiagram();
      } else {
        const file = require(filename);
        console.log(file);
        file.main();
      }
    }
  }
}

async function loadMainContent(url, bool) {
  const newSectionName = `cd-${url.replace('.html', '')}`;

  window.section = document.createElement('div');
  section.classList.add(newSectionName);
  section.innerHTML = await fetchHtmlAsText(url);

  // body.append(cdlb);

  document.querySelector('main')
    .innerHTML = section.querySelector('main').innerHTML;
  // document.querySelector('main').append(section.querySelector('main'));

  const ab = document.querySelector('.actions-block');
  ab.classList.add('page-is-back-changing');
  setTimeout(() => ab.classList.remove('page-is-back-changing'), 1000);

  // drawDiagram();

  const animElems = document.querySelectorAll('.menu-trans-anim');
  for (const ael of animElems) {
    ael.addEventListener('click', (event) => {
      event.preventDefault();
      const newPage = ael.getAttribute('href');
      changePage(newPage, true);
    });
  }

  const scripts = section.querySelectorAll('main scr');
  if (scripts.length > 0) {
    for (const script of scripts) {
      console.log(script);
      const filename = script.getAttribute('src');

      if (filename === './diagram.js') {
        const file = require(filename);
        console.log(file);
        file.drawDiagram();
      } else {
        const file = require(filename);
        console.log(file);
        file.main();
      }
    }
  }
}

window.onload = function () {
  const animElems = document.querySelectorAll('.menu-trans-anim');
  for (const ael of animElems) {
    ael.addEventListener('click', (event) => {
      event.preventDefault();
      const newPage = ael.getAttribute('href');
      changePage(newPage, true);
    });
  }
};

async function fetchHtmlAsText(url) {
  return await (await fetch(url)).text();
}
