# Booking Plugin

A lightweight, responsive booking plugin that can be easily embedded into any website. The plugin provides a clean interface for users to make bookings with name, phone number, date, and time slot selection.

## Features

- Clean and responsive UI
- Input validation for all fields
- Dynamic time slot availability
- Mobile-friendly design
- Easy integration
- Customizable styling
- Prevents double-booking
- Success/error message handling

## Installation

1. Download the plugin files:
   - `style.css`
   - `script.js`

2. Include the files in your HTML:
```html
<link rel="stylesheet" href="path/to/style.css">
```

3. Add the booking plugin container to your HTML:
```html
<div id="booking-plugin"></div>
```

4. Add the script at the end of your body:
```html
<script src="path/to/script.js"></script>
```

That's it! The plugin will automatically initialize when it finds the `booking-plugin` div.

## Customization

The plugin uses CSS variables for easy customization. You can override these variables in your own CSS:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #2c3e50;
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --background-color: #f5f6fa;
    --text-color: #2c3e50;
    --border-color: #dcdde1;
}
```

## API Integration

The plugin is configured to use the production API at `https://riafy-backend.onrender.com/api`. If you need to use a different backend, update the `apiBaseUrl` in `script.js`:

```javascript
this.apiBaseUrl = 'https://your-api-url/api';
```

The plugin expects two endpoints:
- `GET /available_slots?date=YYYY-MM-DD`: Fetch available slots for a given date
- `POST /book_appointment`: Create a new booking with name, phone_number, date, and time_slot

## Browser Support

The plugin supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
