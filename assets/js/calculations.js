document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const calcWrap = document.querySelector(".js-calculator");
    if (!calcWrap) return;
    
    const sliderMarkers = [10000, 100000, 1000000, 10000000, 100000000];
    const writesRange = calcWrap.querySelector("[data-for='writes']");
    const queriesRange = calcWrap.querySelector("[data-for='queries']");
    const storageRange = calcWrap.querySelector("[data-for='storage']");
    const discountValue = calcWrap.querySelector("[data-discount]");

    // Parse price values as numbers
    const WRITE_CENT_PER_GB = parseFloat(writesRange.dataset.price);
    const STORAGE_CENT_PER_GB = parseFloat(storageRange.dataset.price);
    const SERVER_READ_CENT_PER_TB = parseFloat(queriesRange.dataset.price);
    const FREE_CREDITS = parseFloat(discountValue.dataset.discount);

    const BYTES_PER_MB = 1024 * 1024;
    const MIN_READ_BYTES = 64 * BYTES_PER_MB;
    const BYTES_PER_GB = 1024 * 1024 * 1024;
    const BYTES_PER_TB = 1024 * 1024 * 1024 * 1024;
    const CENTS_PER_DOLLAR = 100;

    function prettifyNumber(n) {
      return n.toLocaleString("en-US");
    }

    function updateSliderProgress(id) {
      const slider = calcWrap.querySelector(`[data-for="${id}"]`); // Fixed selector
      if (!slider) return;
      
      const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty("--percent", `${percent}%`);
    }

    function updateCalculator() {
      updateSliderProgress("writes");
      updateSliderProgress("queries");
      updateSliderProgress("storage");

      const dimensions = parseInt(
        calcWrap.querySelector('[data-for="dimensions"]').value
      );
      const attributes = parseInt(
        calcWrap.querySelector('[data-for="attributes"]').value
      );

      const writesIndex = parseInt(
        writesRange.value
      );
      const queriesIndex = parseInt(
        queriesRange.value
      );
      const storageIndex = parseInt(
        storageRange.value
      );

      const numVectorsWritten = sliderMarkers[writesIndex];
      const numQueries = sliderMarkers[queriesIndex];
      const numVectorsStored = sliderMarkers[storageIndex];

      // document.getElementById("writes-value").innerText =
      //   prettifyNumber(numVectorsWritten);
      // document.getElementById("queries-value").innerText =
      //   prettifyNumber(numQueries);
      // document.getElementById("storage-value").innerText =
      //   prettifyNumber(numVectorsStored);

      const totalWritesInBytes =
        numVectorsWritten * (dimensions * 4 + attributes);
      const writeCost =
        ((totalWritesInBytes / BYTES_PER_GB) * WRITE_CENT_PER_GB) /
        CENTS_PER_DOLLAR;

      const totalInternalReadsInBytes = numQueries * MIN_READ_BYTES;
      const queryCost =
        ((totalInternalReadsInBytes / BYTES_PER_TB) * SERVER_READ_CENT_PER_TB) /
        CENTS_PER_DOLLAR;
      const queriesCost = queryCost;

      const totalStoredInBytes =
        numVectorsStored * (dimensions * 4 + attributes);
      const storageCost =
        ((totalStoredInBytes / BYTES_PER_GB) * STORAGE_CENT_PER_GB) /
        CENTS_PER_DOLLAR;

      const totalCost = writeCost + queriesCost + storageCost;
      const firstMonth = Math.max(0, totalCost - FREE_CREDITS);

      calcWrap.querySelector('[data-result="writes"]').innerText = `$${writeCost.toFixed(
        2
      )}`;

      calcWrap.querySelector('[data-result="queries"]').innerText = `$${queriesCost.toFixed(2)}`;

      calcWrap.querySelector('[data-result="storage"]').innerText = `$${storageCost.toFixed(2)}`;

      calcWrap.querySelector(".js-total-value").innerText = `$${totalCost.toFixed(
        2
      )}`;
      calcWrap.querySelector(".js-total-first-month").innerText = `$${firstMonth.toFixed(
        2
      )}`;
    }

    [
      "dimensions",
      "attributes",
      "writes",
      "queries",
      "storage",
    ].forEach((id) => {
      const el = calcWrap.querySelector(`[data-for=${id}]`);
      if (el) el.addEventListener("input", updateCalculator);
    });

    updateCalculator();
  })();
});
