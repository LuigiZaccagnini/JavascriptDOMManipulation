(function() {
  /**
   * Helper object for working with countries data and extracting information.
   * See countries-data.js for format of the countries data set.
   */
  let countries = {
    /**
     * Store all countries from countries-data.js on `countries.all` for convenience.
     */
    all: window.countriesData,

    /**
     * Return an array of all countries, with the Name Object replaced by the
     * appropriate translation, or English if not specified (or unknown).  For
     * example, when language="English", you would process the record for Canada into:
     *
     * {
     *     code: "CA",
     *     continent: "Americas",
     *     areaInKm2: 9984670,
     *     population: 36624199,
     *     capital: "Ottawa",
     *     name: "Canada"
     * }
     *
     * Supported languages include:
     *
     * English, Arabic, Chinese, French, Hindi, Korean, Japanese, Russian
     *
     * Uses `countries.all` as the underlying array of countries to be processed.
     *
     * HINT: make sure you don't overwrite the original name object.
     */
    getByLanguage: function(language) {
      let countriesByLanguage = [];

      countries.all.forEach(element => {
        countriesByLanguage.push({
          code: element.code,
          continent: element.continent,
          areaInKm2: element.areaInKm2,
          population: element.population,
          capital: element.capital,
          name: element.name[language]
        });
      });

      return countriesByLanguage;
    },

    /**
     * Return an array of countries with a population greater than or equal to
     * `minPopulation`, and possibly less than equal to `maxPopulation` (if defined)
     * otherwise allow any number greater than `minPopulation`.
     *
     * Uses getByLanguage('English') to get English names for countries.
     *
     * @param {Number} minPopulation - (Required) minimum population value
     * @param {Number} maxPopulation - (Optional) maximum population value
     */
    getByPopulation: function(minPopulation, maxPopulation) {
      let countriesByLanguage = this.getByLanguage('English');
      let countriesByPopulation = [];

      countriesByLanguage.forEach(element => {
        if (
          maxPopulation &&
          element.population > minPopulation &&
          element.population < maxPopulation
        ) {
          countriesByPopulation.push(element);
        } else if (element.population > minPopulation) {
          countriesByPopulation.push(element);
        }
      });

      return countriesByPopulation;
    },

    /**
     * Return an array of countries for the given `continent` with an area
     * greater than or equal to the given `area` in square KM.
     *
     * Uses getByLanguage('English') to get English names for countries.
     *
     * @param {String} continent - (Required) name of the continent (e.g., Europe)
     * @param {Number} minArea - (Required) minimum number of KM2 area
     */
    getByAreaAndContinent: function(continent, minArea) {
      let countriesByLanguage = this.getByLanguage('English');
      let countriesByContinent = [];

      countriesByLanguage.forEach(element => {
        if (element.continent === continent && element.areaInKm2 >= minArea) {
          countriesByContinent.push(element);
        }
      });

      return countriesByContinent;
    }
  };

  /**
   * Helper functions for building table elements.
   */
  let tableHelper = {
    /**
     * Clears (any) existing rows from the #table-rows table body
     */
    clearTable: function() {
      document.getElementById('table-rows').innerHTML = '';
    },

    /**
     * Takes a `country.code` (e.g., "CA" for Canada) and returns an <img>
     * element with its `src` property set the appropriate flag image URL
     * for this code, e.g., src="flags/ca.png" for Canada.
     */
    countryCodeToFlagImg: function(countryCode) {
      let flag = document.createElement('img');
      flag.src = `flags/${countryCode.toLowerCase()}.png`;
      flag.alt = `${countryCode}`;
      return flag;
    },

    /**
     * Takes a single `country` object and converts it to a <tr> with <td>
     * child elements for every column in the row.  The row should match the
     * expected format of the table (i.e., flag, code, country, continent, etc).
     * Return the new <tr>...</tr> row.
     *
     * Use the DOM methods document.createElement(), element.appendChild(), etc
     * to create your <tr> row.
     */
    countryToRow: function(country) {
      let countryRow = document.createElement('tr');

      let countryFlag = this.countryCodeToFlagImg(country.code);
      countryRow.append(countryFlag);

      createTableData(country.code, countryRow);
      createTableData(country.name, countryRow);
      createTableData(country.continent, countryRow);
      createTableData(country.areaInKm2, countryRow);
      createTableData(country.population, countryRow);
      createTableData(country.capital, countryRow);

      return countryRow;
    },

    /**
     * Takes an array of `country` Objects named `countries`, and passes each
     * `country` in the array  to `tableHelper.countryToRow()`.  The resulting
     * rows are then appended to the #table-rows table body element.  Make sure
     * you use `tableHelper.clear()` to remove any existing rows before you do this.
     */
    countriesToTable: function(countries) {
      this.clearTable();

      countries.forEach(element => {
        let row = this.countryToRow(element);
        document.getElementById('table-rows').append(row);
      });
    }
  };

  /**
   * Register click handlers for every menu item in the page.  Use the `countries`
   * and `tableHelper` Objects, and their associated methods, to update/populate
   * the #table-rows table body with the appropriate set of countries, based on the
   * menu item clicked.
   *
   * Make sure you also update the #subtitle heading to properly reflect what
   * is in the table after you populate it. For example: "List of Countries
   * and Dependencies - Population between 1 and 2 million" or "List of Countries
   * and Dependencies - All countries in Asia" etc.
   */
  function setupMenuHandlers() {
    let byLanguage = Object.keys(countries.all[0].name);

    byLanguage.forEach(element => {
      let menuTab = document.getElementById(`menu_${element.toLowerCase()}`);

      menuTab.addEventListener('click', function() {
        tableHelper.countriesToTable(countries.getByLanguage(element));
      });
    });

    let populationGreater = document.getElementById('menu_population_100_000_000m');
    let populationOneMillionGreater = document.getElementById('menu_population_1m_2m');

    let americas1KM = document.getElementById('menu_americas_1mkm');
    let asiaAll = document.getElementById('menu_asia_all');

    populationGreater.addEventListener('click', function() {
      tableHelper.countriesToTable(countries.getByPopulation(100000000));
    });

    populationOneMillionGreater.addEventListener('click', function() {
      tableHelper.countriesToTable(countries.getByPopulation(1000000, 2000000));
    });

    americas1KM.addEventListener('click', function() {
      tableHelper.countriesToTable(countries.getByAreaAndContinent('Americas', 1000000));
    });

    asiaAll.addEventListener('click', function() {
      tableHelper.countriesToTable(countries.getByAreaAndContinent('Asia', 0));
    });
  }

  // When the page loads, setup all event handlers by calling setup function.
  window.onload = setupMenuHandlers;
})();

function createTableData(data, appendTo) {
  let countryCode = document.createElement('td');
  countryCode.innerHTML = data;
  appendTo.append(countryCode);
}
