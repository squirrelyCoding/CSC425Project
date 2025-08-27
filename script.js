// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the elements
    const userInput = document.getElementById('userInput');
    const addButton = document.getElementById('addItem');
    const myList = document.getElementById('myList');

    // Function to add an item to the list
    function addItemToList() {
        // Get the input value and trim whitespace
        const inputValue = userInput.value.trim();
        
        // Check if input is not empty
        if (inputValue !== '') {
            // Create a new list item
            const listItem = document.createElement('li');
            listItem.textContent = inputValue;
            
            // Add click event to remove item (bonus feature)
            listItem.addEventListener('click', function() {
                listItem.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    myList.removeChild(listItem);
                }, 300);
            });
            
            // Add the item to the list
            myList.appendChild(listItem);
            
            // Clear the input field
            userInput.value = '';
            
            // Focus back on the input for better user experience
            userInput.focus();
        }
    }

    // Add event listener to the button
    addButton.addEventListener('click', addItemToList);

    // Add event listener for Enter key press in input field
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addItemToList();
        }
    });

    // Focus on input field when page loads
    userInput.focus();
});

// Add CSS animation for slide out effect
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);
