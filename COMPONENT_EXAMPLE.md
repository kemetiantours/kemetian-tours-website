# Component Structure Examples

This guide shows how to structure components in the KemetianTours project following industry best practices.

## 📦 Component File Organization

Each component should have its own folder with the following structure:

```
src/components/ComponentName/
├── ComponentName.js          # Component logic
├── ComponentName.css         # Component styles
├── ComponentName.test.js     # Unit tests
└── index.js                  # Export file
```

## 🏗️ Example: DestinationCard Component

### 1. **index.js** - Export file

```javascript
// src/components/DestinationCard/index.js
import DestinationCard from './DestinationCard';

export default DestinationCard;
```

### 2. **DestinationCard.js** - Component logic

```javascript
/**
 * DestinationCard Component
 * 
 * Displays a single travel destination with image, description, and CTA.
 * 
 * @component
 * @example
 * const destination = {
 *   id: '1',
 *   name: 'Cairo',
 *   image: '/images/cairo.jpg',
 *   description: 'Experience ancient wonders',
 *   price: 2500,
 *   rating: 4.8,
 *   reviews: 120
 * };
 * return <DestinationCard destination={destination} />
 */

import './DestinationCard.css';

/**
 * Formats price with currency symbol
 * @param {number} price - Price in USD
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * DestinationCard component
 * @param {Object} props - Component props
 * @param {Object} props.destination - Destination data object
 * @param {string} props.destination.id - Unique identifier
 * @param {string} props.destination.name - Destination name
 * @param {string} props.destination.image - Image URL
 * @param {string} props.destination.description - Short description
 * @param {number} props.destination.price - Starting price
 * @param {number} props.destination.rating - Customer rating (0-5)
 * @param {number} props.destination.reviews - Number of reviews
 * @param {Function} [props.onSelect] - Callback when card is clicked
 * @returns {HTMLElement} Rendered component
 */
function DestinationCard({ destination, onSelect }) {
  // Validate required props
  if (!destination || !destination.id) {
    console.error('DestinationCard: destination prop is required');
    return null;
  }

  const {
    id,
    name,
    image,
    description,
    price,
    rating,
    reviews,
  } = destination;

  /**
   * Handle card click event
   */
  function handleClick() {
    if (onSelect) {
      onSelect(id);
    }
  }

  /**
   * Handle keyboard navigation (accessibility)
   */
  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }

  return (
    <article
      className="destination-card"
      data-test="destination-card"
      data-destination-id={id}
    >
      {/* Image container with lazy loading */}
      <div className="destination-card__image-wrapper">
        <img
          className="destination-card__image"
          src={image}
          alt={`${name} destination in Egypt`}
          loading="lazy"
          decoding="async"
        />
        {/* Overlay gradient */}
        <div className="destination-card__overlay" />
      </div>

      {/* Content container */}
      <div className="destination-card__content">
        {/* Header with title and rating */}
        <div className="destination-card__header">
          <h2 className="destination-card__title">{name}</h2>
          <div className="destination-card__rating" aria-label={`Rating: ${rating} out of 5`}>
            <span className="destination-card__stars">★</span>
            <span className="destination-card__rating-value">{rating}</span>
            <span className="destination-card__review-count">({reviews})</span>
          </div>
        </div>

        {/* Description */}
        <p className="destination-card__description">{description}</p>

        {/* Footer with price and CTA */}
        <div className="destination-card__footer">
          <div className="destination-card__price">
            <span className="destination-card__price-label">From</span>
            <span className="destination-card__price-value">{formatPrice(price)}</span>
          </div>
          <button
            className="destination-card__button"
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            aria-label={`View ${name} tour details`}
          >
            Explore
          </button>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
```

### 3. **DestinationCard.css** - Component styles

```css
/* src/components/DestinationCard/DestinationCard.css */

.destination-card {
  @apply rounded-lg shadow-md overflow-hidden bg-white transition-all duration-300 hover:shadow-lg cursor-pointer;
  
  /* Hover effect */
  @apply hover:scale-105;
}

.destination-card:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary-500;
}

.destination-card__image-wrapper {
  @apply relative overflow-hidden h-64 bg-gray-200;
}

.destination-card__image {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.destination-card:hover .destination-card__image {
  @apply scale-110;
}

.destination-card__overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300;
}

.destination-card:hover .destination-card__overlay {
  @apply opacity-100;
}

.destination-card__content {
  @apply p-4 flex flex-col h-full;
}

.destination-card__header {
  @apply mb-3;
}

.destination-card__title {
  @apply text-xl font-bold text-gray-900 mb-2;
}

.destination-card__rating {
  @apply flex items-center gap-2;
}

.destination-card__stars {
  @apply text-yellow-400 text-lg;
}

.destination-card__rating-value {
  @apply font-semibold text-gray-900;
}

.destination-card__review-count {
  @apply text-sm text-gray-500;
}

.destination-card__description {
  @apply text-sm text-gray-600 mb-4 flex-grow;
}

.destination-card__footer {
  @apply flex items-center justify-between;
}

.destination-card__price {
  @apply flex flex-col;
}

.destination-card__price-label {
  @apply text-xs text-gray-500 uppercase font-semibold;
}

.destination-card__price-value {
  @apply text-lg font-bold text-primary-600;
}

.destination-card__button {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold transition-colors duration-300;
  @apply hover:bg-primary-700 active:bg-primary-800;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Responsive design */
@media (max-width: 640px) {
  .destination-card {
    @apply rounded-md;
  }

  .destination-card__image-wrapper {
    @apply h-48;
  }

  .destination-card__content {
    @apply p-3;
  }

  .destination-card__title {
    @apply text-lg;
  }
}
```

### 4. **DestinationCard.test.js** - Unit tests

```javascript
// src/components/DestinationCard/DestinationCard.test.js

import DestinationCard from './DestinationCard';

describe('DestinationCard', () => {
  const mockDestination = {
    id: '1',
    name: 'Cairo',
    image: '/images/cairo.jpg',
    description: 'Experience ancient wonders',
    price: 2500,
    rating: 4.8,
    reviews: 120,
  };

  describe('Rendering', () => {
    it('should render destination card with all information', () => {
      const element = DestinationCard({ destination: mockDestination });
      
      expect(element.querySelector('.destination-card__title').textContent)
        .toBe('Cairo');
      expect(element.querySelector('.destination-card__description').textContent)
        .toBe('Experience ancient wonders');
    });

    it('should display formatted price', () => {
      const element = DestinationCard({ destination: mockDestination });
      
      expect(element.querySelector('.destination-card__price-value').textContent)
        .toContain('$2,500.00');
    });

    it('should show rating and review count', () => {
      const element = DestinationCard({ destination: mockDestination });
      
      expect(element.querySelector('.destination-card__rating-value').textContent)
        .toBe('4.8');
      expect(element.querySelector('.destination-card__review-count').textContent)
        .toContain('120');
    });

    it('should render with correct alt text for image', () => {
      const element = DestinationCard({ destination: mockDestination });
      
      expect(element.querySelector('img').alt)
        .toBe('Cairo destination in Egypt');
    });

    it('should handle missing image gracefully', () => {
      const destination = { ...mockDestination, image: '' };
      const element = DestinationCard({ destination });
      
      expect(element.querySelector('img').src).toBe('');
    });
  });

  describe('Events', () => {
    it('should call onSelect callback when button is clicked', () => {
      const onSelect = jest.fn();
      const element = DestinationCard({
        destination: mockDestination,
        onSelect,
      });
      
      element.querySelector('.destination-card__button').click();
      
      expect(onSelect).toHaveBeenCalledWith('1');
    });

    it('should handle keyboard navigation', () => {
      const onSelect = jest.fn();
      const element = DestinationCard({
        destination: mockDestination,
        onSelect,
      });
      
      const button = element.querySelector('.destination-card__button');
      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      
      button.dispatchEvent(event);
      
      expect(onSelect).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const element = DestinationCard({ destination: mockDestination });
      
      expect(element.querySelector('[aria-label]')).toBeTruthy();
    });

    it('should have semantic HTML', () => {
      const element = DestinationCard({ destination: mockDestination });
      
      expect(element.tagName.toLowerCase()).toBe('article');
    });
  });

  describe('Error Handling', () => {
    it('should return null if destination is missing', () => {
      const element = DestinationCard({ destination: null });
      
      expect(element).toBeNull();
    });

    it('should return null if destination.id is missing', () => {
      const destination = { ...mockDestination };
      delete destination.id;
      const element = DestinationCard({ destination });
      
      expect(element).toBeNull();
    });
  });
});
```

## 🗂️ Data Structure Example

### **src/data/destinations.json**

```json
{
  "destinations": [
    {
      "id": "1",
      "name": "Cairo",
      "slug": "cairo",
      "image": "/images/destinations/cairo.jpg",
      "images": [
        "/images/destinations/cairo-1.jpg",
        "/images/destinations/cairo-2.jpg",
        "/images/destinations/cairo-3.jpg"
      ],
      "description": "Experience ancient wonders",
      "longDescription": "Discover the magic of Egypt's capital with visits to the iconic Pyramids of Giza, the Great Sphinx, and the Egyptian Museum. Explore vibrant bazaars and enjoy traditional felucca rides along the Nile.",
      "price": 2500,
      "currency": "USD",
      "duration": 4,
      "rating": 4.8,
      "reviews": 120,
      "highlights": [
        "Pyramids of Giza",
        "Egyptian Museum",
        "Khan el-Khalili Bazaar",
        "Nile Felucca Ride"
      ],
      "included": [
        "Hotel (4-star)",
        "All meals",
        "Licensed guide",
        "Transportation"
      ],
      "season": "year-round"
    }
  ]
}
```

## 📝 JavaScript Module Example

### **src/scripts/modules/carousel.js**

```javascript
/**
 * Carousel Module
 * Handles image carousel functionality with keyboard and touch support
 * 
 * @module carousel
 */

/**
 * Initialize carousel on element
 * @param {HTMLElement} element - Carousel container element
 * @param {Object} options - Configuration options
 * @param {number} [options.autoplay=true] - Auto-play carousel
 * @param {number} [options.interval=5000] - Time between slides (ms)
 * @param {boolean} [options.loop=true] - Loop carousel at end
 * @returns {Object} Carousel API
 */
function initCarousel(element, options = {}) {
  const {
    autoplay = true,
    interval = 5000,
    loop = true,
  } = options;

  if (!element) {
    console.error('Carousel: Element not found');
    return null;
  }

  let currentIndex = 0;
  let autoplayTimer = null;
  const slides = element.querySelectorAll('[data-slide]');

  if (slides.length === 0) {
    console.warn('Carousel: No slides found');
    return null;
  }

  /**
   * Show slide at index
   * @param {number} index - Slide index
   */
  function showSlide(index) {
    // Handle loop
    if (index >= slides.length) {
      currentIndex = loop ? 0 : slides.length - 1;
    } else if (index < 0) {
      currentIndex = loop ? slides.length - 1 : 0;
    } else {
      currentIndex = index;
    }

    // Update slide visibility
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
      slide.setAttribute('aria-hidden', i !== currentIndex);
    });

    // Update indicators if present
    const indicators = element.querySelectorAll('[data-indicator]');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
      indicator.setAttribute('aria-current', i === currentIndex);
    });

    // Emit custom event
    element.dispatchEvent(new CustomEvent('carousel:change', {
      detail: { currentIndex, total: slides.length },
    }));
  }

  /**
   * Start autoplay
   */
  function startAutoplay() {
    if (!autoplay) return;

    autoplayTimer = setInterval(() => {
      goToNext();
    }, interval);
  }

  /**
   * Stop autoplay
   */
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  /**
   * Go to next slide
   */
  function goToNext() {
    showSlide(currentIndex + 1);
  }

  /**
   * Go to previous slide
   */
  function goToPrev() {
    showSlide(currentIndex - 1);
  }

  /**
   * Go to specific slide
   */
  function goToSlide(index) {
    showSlide(index);
  }

  /**
   * Get current slide index
   */
  function getCurrentIndex() {
    return currentIndex;
  }

  // Event listeners
  const nextBtn = element.querySelector('[data-next]');
  const prevBtn = element.querySelector('[data-prev]');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      goToNext();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      goToPrev();
      startAutoplay();
    });
  }

  // Keyboard navigation
  element.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      stopAutoplay();
      goToNext();
      startAutoplay();
    } else if (event.key === 'ArrowLeft') {
      stopAutoplay();
      goToPrev();
      startAutoplay();
    }
  });

  // Pause on hover
  element.addEventListener('mouseenter', stopAutoplay);
  element.addEventListener('mouseleave', startAutoplay);

  // Initialize
  showSlide(0);
  startAutoplay();

  // Return public API
  return {
    next: goToNext,
    prev: goToPrev,
    go: goToSlide,
    getCurrent: getCurrentIndex,
    start: startAutoplay,
    stop: stopAutoplay,
    destroy: () => {
      stopAutoplay();
      nextBtn?.removeEventListener('click', goToNext);
      prevBtn?.removeEventListener('click', goToPrev);
    },
  };
}

export default initCarousel;
```

## ✅ Best Practices Checklist

- [ ] Single responsibility per component/module
- [ ] Descriptive naming conventions
- [ ] JSDoc comments for all functions
- [ ] Error handling with meaningful messages
- [ ] Proper HTML semantics
- [ ] ARIA labels for accessibility
- [ ] Mobile-responsive design
- [ ] Unit tests for all components
- [ ] No console.logs in production code
- [ ] No hardcoded values (use constants or config)
- [ ] Lazy loading for images
- [ ] Event delegation where appropriate
- [ ] Memory leak prevention (cleanup listeners)
- [ ] Cross-browser compatibility

---

For more examples, check the `src/components` and `src/scripts/modules` directories.
