import { useEffect, useState } from "react"
import { Grouping } from "./useGameState"

export function useGroupings(date: Date) {

  const [groupings, setGroupings] = useState<Grouping[]>()

  useEffect(() => {
    loadWords()
  }, [])

  async function loadWords() {

    try {
      const response = await fetch("https://opensheet.elk.sh/1KWCELv96If20u8H5_3b4pR0fo4Z8Dd61uxFTCuVas48/solutions-tab")
      const data = (await response.json()) as SheetRow[]
      const dateString = date.toISOString().split('T')[0]
      let rowsForDate = data.filter(row => row.date.trim() === dateString)

      // If no game for today, pick a random game
      if (rowsForDate.length !== 4) {
        // Group all rows by date
        const groupedByDate: { [key: string]: SheetRow[] } = {}
        data.forEach(row => {
          const d = row.date.trim()
          if (!groupedByDate[d]) groupedByDate[d] = []
          groupedByDate[d].push(row)
        })
        // Find all dates with 4 rows (valid games)
        const validDates = Object.keys(groupedByDate).filter(d => groupedByDate[d].length === 4)
        if (validDates.length > 0) {
          // Use current date as seed for deterministic "random" selection
          const epochMs = new Date("February 14, 2022 00:00:00").valueOf();
          const now = Date.now();
          const msInDay = 86400000;
          const index = Math.floor((now - epochMs) / msInDay);
          const randomDate = validDates[index % validDates.length]
          rowsForDate = groupedByDate[randomDate]
        }
      }

      if (rowsForDate.length === 4) {
        setGroupings(
          rowsForDate.map(row => ({
            group: row.group,
            difficulty: Number(row.difficulty),
            words: [row.word1, row.word2, row.word3, row.word4]
          })).sort((a, b) => a.difficulty - b.difficulty)
        )
      }
    } catch (error) {

    }
  }

  return groupings
}

type SheetRow = {
  date: string
  difficulty: string
  group: string
  word1: string
  word2: string
  word3: string
  word4: string
}

export const emptyGrouping: Grouping[] = [
  {
    group: "",
    difficulty: 1,
    words: ["", "", "", ""]
  },
  {
    group: "",
    difficulty: 2,
    words: ["", "", "", ""]
  },
  {
    group: "",
    difficulty: 3,
    words: ["", "", "", ""]
  },
  {
    group: "",
    difficulty: 4,
    words: ["", "", "", ""]
  }
]

