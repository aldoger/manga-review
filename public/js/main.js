document.addEventListener('DOMContentLoaded', () => {
    const mangaImgContainers = document.querySelectorAll('.manga-img-container');
    const pageLoading = document.getElementById('page-loading'); // Global loading spinner

    let imagesLoaded = 0;
    const totalImages = mangaImgContainers.length;

    if (totalImages === 0) {
        pageLoading.style.display = 'none'; // If no images, hide the loading spinner immediately
    }

    mangaImgContainers.forEach(container => {
        const isbn = container.getAttribute('data-isbn');
        const title = container.getAttribute('data-title');

        const img = loadImage(isbn, title); // Call the loadImage function
        container.appendChild(img); // Append the loaded image to the container

        // Track when all images are loaded
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                // Once all images are loaded, hide the loading spinner
                pageLoading.style.display = 'none';
            }
        };

        img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                pageLoading.style.display = 'none';
            }
        };
    });
});

function loadImage(isbn, title) {
    const img = new Image();
    const imgUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

    console.log('Generated image URL:', imgUrl); // Debugging line

    // Find the loading spinner element inside the container
    const container = document.querySelector(`[data-isbn='${isbn}'][data-title='${title}']`);
    const spinner = container.querySelector('.loading-spinner');

    img.src = imgUrl;

    img
        .decode()
        .then(() => {
            console.log('Image loaded successfully:', imgUrl); // Debugging line
            img.classList.add('manga-img');
            img.alt = `${title}-cover`;

            // Remove the loading spinner and show the image
            spinner.style.display = 'none';
            container.appendChild(img); // Add the image to the container
        })
        .catch(encodingError => {
            console.error('Error loading image:', encodingError); // Debugging line
            spinner.textContent = 'Failed to load image'; // Optional: show error message
        });

    return img;
}
