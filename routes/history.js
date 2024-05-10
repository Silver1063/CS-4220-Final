// 1. Endpoint GET /history

// This endpoint retrieves data from the search_history collection in MongoDB
// This endpoint accepts and an optional query parameter:  searchTerm
// If no query parameter is provided, returns a JSON response of all search history saved in the Atlas Cloud MongoDB.
// If a query parameter is provided, returns a JSON response of the search history associated with the search term in the Atlas Cloud MongoDB.