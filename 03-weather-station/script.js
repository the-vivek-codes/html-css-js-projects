const apiKey = "d10903cf97d74842878155034260507"
const statusEl = document.getElementById('status')
const readingEl = document.getElementById('reading')
const fetchBtn = document.getElementById('fetchBtn')

function setStatus(msg, isError) {
    statusEl.textContent = msg || ''
    statusEl.classList.toggle('error', !!isError)
}

function dayLabel(dateStr, idx) {
    if (idx === 0) return 'Today'
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString(undefined, { weekday: 'short' })
}

async function fetchWeather(query) {
    fetchBtn.disabled = true
    setStatus('Taking reading…')
    readingEl.classList.remove('show')

    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&days=3&aqi=no&alerts=no`
        const res = await fetch(url)
        const data = await res.json()

        if (!res.ok || data.error) {
            const msg = data && data.error ? data.error.message : `Request failed (${res.status})`
            setStatus(msg, true)
            fetchBtn.disabled = false
            return
        }

        const loc = data.location
        const cur = data.current
        const forecastDays = data.forecast.forecastday

        const weatherIcon = document.getElementById("weatherIcon")
        weatherIcon.src = "https:" + cur.condition.icon
        weatherIcon.alt = cur.condition.text

        document.getElementById('place').textContent = `${loc.name}, ${loc.region || loc.country}`
        document.getElementById('placeMeta').textContent = `${loc.country} · Local time ${loc.localtime.split(' ')[1]}`
        document.getElementById('condition').textContent = cur.condition.text
        document.getElementById('feelsLike').textContent = `${Math.round(cur.feelslike_c)}°C`
        document.getElementById('wind').textContent = `${cur.wind_kph} kph ${cur.wind_dir}`
        document.getElementById('humidity').textContent = `${cur.humidity}%`
        document.getElementById('lastUpdated').textContent = `Updated ${cur.last_updated.split(' ')[1]}`

        document.getElementById('temperature').textContent = `${Math.round(cur.temp_c)}°C`

        const logEl = document.getElementById('log')
        logEl.innerHTML = forecastDays.map((d, i) => `
        <div class="entry">
          <div class="day">${dayLabel(d.date, i)}</div>
          <div class="cond">${d.day.condition.text}</div>
          <div class="rain">${d.day.daily_chance_of_rain}% rain</div>
          <div class="range"><span class="hi">${Math.round(d.day.maxtemp_c)}°</span> / <span class="lo">${Math.round(d.day.mintemp_c)}°</span></div>
        </div>
      `).join('')

        readingEl.classList.add('show')
        setStatus('')
    } catch (err) {
        setStatus('Could not reach the station. Check your connection and try again.', true)
    } finally {
        fetchBtn.disabled = false
    }
}

document.getElementById('lookupForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const q = document.getElementById('cityInput').value.trim()
    if (!q) {
        setStatus('Enter a location first.', true)
        return
    }
    fetchWeather(q)
})

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => { /* User denied location or location unavailable */ }
    )
}