import React, { useState } from "react"

const Search = () => {
  const [username, setUsername] = useState("")

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
    </div>
  )
}

export default Search
