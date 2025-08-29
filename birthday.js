// Get the elements from the DOM
        const cardWrapper = document.querySelector('.birthdayCard');
        const cardInner = document.querySelector('.card-inner');
        const cardBody = document.querySelector('.body');

        // State variables for the drag functionality
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let maxDrag = 250; // The maximum drag distance in pixels to fully open the card (adjust as needed)

        // Event listener for mouse down
        cardWrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            // Prevent the transition from playing during drag for a smoother effect
            cardInner.style.transition = 'none';
            // Change cursor to indicate dragging
            cardWrapper.style.cursor = 'grabbing';
        });

        // Event listener for mouse move
        cardBody.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            // Calculate the horizontal drag distance
            currentX = e.pageX;
            const dragDistance = startX - currentX;

            // Map the drag distance to a rotation angle
            // The angle will be between 0 and 180 degrees
            let rotationAngle = (dragDistance / maxDrag) * 180;

            // Clamp the rotation angle so it doesn't go too far
            rotationAngle = Math.min(Math.max(rotationAngle, 0), 180);

            // Apply the rotation transform to the card
            cardInner.style.transform = `rotateY(${rotationAngle}deg)`;
        });

        // Event listener for mouse up
        cardBody.addEventListener('mouseup', () => {
            if (!isDragging) return;

            isDragging = false;
            // Restore the CSS transition for a smooth snapping effect
            cardInner.style.transition = 'transform 0.8s';
            // Restore the cursor
            cardWrapper.style.cursor = 'grab';

            // Get the current rotation angle
            const style = window.getComputedStyle(cardInner);
            const matrix = new DOMMatrix(style.transform);
            const rotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);
            
            // Check if the card has been dragged enough to snap open or close
            if (rotation < 90) {
                // If the rotation is less than 90 degrees, snap it back to closed
                cardInner.style.transform = 'rotateY(0deg)';
            } else {
                // If it's 90 degrees or more, snap it fully open
                cardInner.style.transform = 'rotateY(180deg)';
            }
        });

        // --- Touch events for mobile devices ---

        cardWrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            // Use the first touch point
            startX = e.touches[0].pageX;
            cardInner.style.transition = 'none';
        });

        cardBody.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent page scroll during drag

            currentX = e.touches[0].pageX;
            const dragDistance = startX - currentX;
            let rotationAngle = (dragDistance / maxDrag) * 180;
            rotationAngle = Math.min(Math.max(rotationAngle, 0), 180);
            cardInner.style.transform = `rotateY(${rotationAngle}deg)`;
        });

        cardBody.addEventListener('touchend', () => {
            if (!isDragging) return;

            isDragging = false;
            cardInner.style.transition = 'transform 0.8s';

            const style = window.getComputedStyle(cardInner);
            const matrix = new DOMMatrix(style.transform);
            const rotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);

            if (rotation < 90) {
                cardInner.style.transform = 'rotateY(0deg)';
            } else {
                cardInner.style.transform = 'rotateY(180deg)';
            }
        });
