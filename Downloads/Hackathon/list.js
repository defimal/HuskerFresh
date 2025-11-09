document.getElementById("swipeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let swipe = {
    name: document.getElementById("name").value,
    location: document.getElementById("location").value,
    swipes: document.getElementById("swipes").value,
    expiry: document.getElementById("expiry").value,
    notes: document.getElementById("notes").value
    };

    let stored = JSON.parse(localStorage.getItem("swipes")) || [];
    stored.push(swipe);
    localStorage.setItem("swipes", JSON.stringify(stored));

    alert("Swipe listed successfully!");
    this.reset();
});
