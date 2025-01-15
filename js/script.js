const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box");

// API key, pagination, searchTerm variables
const apiKey = "t4gbibwWyG7qscriaE054bFIMEV39wJc0GwgD8tbHHCqfyv7pD6zsYBB";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card">
                <img src="${img.src.large2x}" alt="image">
                <div class="details">
                    <div class="photographer">
                        <i class="fas fa-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button><i class="fas fa-download"></i></button>
                </div>
            </li>`
    ).join("");
}

const getImages = (apiURL) => {
    // Fetching images by API call with authorization header
    loadMoreBtn.innerText = "Chargement...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Afficher Plus";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Impossible de charger les images :-("));
}

const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    // If searchTerm has some value then call API with search term else call default API
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // If search input is empty, set the search term to null and return from here 
    if(e.target.value === "") return searchTerm = null;
    // If pressed key is Enter, update the current page, search term & call the getImages
    if(e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);