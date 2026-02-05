/**
 * Weather Dashboard Unit Tests
 * 
 * This file contains unit tests for helper functions and component state testing
 * Using Vitest as the testing framework
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

/**
 * HELPER FUNCTIONS FOR TESTING
 * These are extracted from the main app for isolated testing
 */

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format time string to readable format
 * @param {string} timeString - ISO time string
 * @returns {string} Formatted time
 */
function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format temperature value
 * @param {number} temp - Temperature value
 * @returns {string} Formatted temperature with unit
 */
function formatTemperature(temp) {
    return `${temp}°C`;
}


// ============================================================================
// UNIT TESTS - Helper Functions
// ============================================================================

describe('Helper Functions', () => {
    describe('formatDate', () => {
        it('should format ISO date string to readable format', () => {
            const isoDate = '2024-02-10T00:00:00Z';
            const formatted = formatDate(isoDate);
            
            // Check that the formatted string contains expected parts
            expect(formatted).toMatch(/Feb/);
            expect(formatted).toMatch(/10/);
        });

        it('should handle different date formats', () => {
            const date1 = '2024-01-01T00:00:00Z';
            const date2 = '2024-12-31T00:00:00Z';
            
            expect(formatDate(date1)).toContain('Jan');
            expect(formatDate(date2)).toContain('Dec');
        });

        it('should include weekday in output', () => {
            const isoDate = '2024-02-05T00:00:00Z'; // Monday
            const formatted = formatDate(isoDate);
            
            // Should contain a weekday abbreviation (Mon, Tue, etc.)
            expect(formatted).toMatch(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/);
        });
    });

    describe('formatTime', () => {
        it('should format ISO time string to readable format', () => {
            const isoTime = '2024-02-10T14:30:00Z';
            const formatted = formatTime(isoTime);
            
            expect(formatted).toMatch(/Feb/);
            expect(formatted).toMatch(/10/);
            expect(formatted).toMatch(/\d{1,2}:\d{2}/); // Time format HH:MM
        });

        it('should include AM/PM indicator', () => {
            const morningTime = '2024-02-10T09:00:00Z';
            const formatted = formatTime(morningTime);
            
            expect(formatted).toMatch(/(AM|PM)/);
        });
    });

    describe('formatTemperature', () => {
        it('should format temperature with Celsius unit', () => {
            expect(formatTemperature(25)).toBe('25°C');
            expect(formatTemperature(0)).toBe('0°C');
            expect(formatTemperature(-5)).toBe('-5°C');
        });

        it('should handle decimal temperatures', () => {
            expect(formatTemperature(25.5)).toBe('25.5°C');
        });
    });
});


const WeatherDashboardComponent = {
    template: `
        <div class="weather-dashboard">
            <!-- Loading State -->
            <div v-if="loading" class="loading" data-testid="loading-state">
                <div class="loading-spinner"></div>
                <p>Fetching weather data...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error" data-testid="error-state">
                <div class="error-icon">⚠️</div>
                <h2>{{ error }}</h2>
            </div>
            <!-- Weather Data State -->
            <div v-else-if="currentWeather" class="current-weather" data-testid="weather-state">
                <div class="location">{{ currentWeather.city }}, {{ currentWeather.country }}</div>
                <div class="temperature">{{ currentWeather.temperature }}°C</div>
                <div class="condition">{{ currentWeather.condition }}</div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state" data-testid="empty-state">
                <p>Search for a city to see weather information</p>
            </div>
        </div>
    `,
    props: {
        loading: Boolean,
        error: String,
        currentWeather: Object
    }
};

describe('Weather Dashboard Component States', () => {
    describe('Loading State', () => {
        it('should display loading state when loading is true', () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: true,
                    error: null,
                    currentWeather: null
                }
            });

            const loadingElement = wrapper.find('[data-testid="loading-state"]');
            expect(loadingElement.exists()).toBe(true);
            expect(loadingElement.text()).toContain('Fetching weather data');
        });

        it('should show loading spinner when loading', () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: true,
                    error: null,
                    currentWeather: null
                }
            });

            expect(wrapper.find('.loading-spinner').exists()).toBe(true);
        });

        it('should not display other states when loading', () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: true,
                    error: 'Some error',
                    currentWeather: { city: 'London' }
                }
            });

            expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(false);
            expect(wrapper.find('[data-testid="weather-state"]').exists()).toBe(false);
        });
    });

    describe('Error State', () => {
        it('should display error message when error exists', () => {
            const errorMessage = 'Failed to fetch weather data';
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: errorMessage,
                    currentWeather: null
                }
            });

            const errorElement = wrapper.find('[data-testid="error-state"]');
            expect(errorElement.exists()).toBe(true);
            expect(errorElement.text()).toContain(errorMessage);
        });

        it('should show error icon', () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: 'Network error',
                    currentWeather: null
                }
            });

            expect(wrapper.find('.error-icon').exists()).toBe(true);
        });

        it('should not display loading or weather states when error exists', () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: 'Some error',
                    currentWeather: { city: 'London' }
                }
            });

            expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false);
            expect(wrapper.find('[data-testid="weather-state"]').exists()).toBe(false);
        });
    });

    describe('Weather Data State', () => {
        it('should display weather data when available', () => {
            const mockWeather = {
                city: 'Tokyo',
                country: 'Japan',
                temperature: 22,
                condition: 'Sunny'
            };

            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: null,
                    currentWeather: mockWeather
                }
            });

            const weatherElement = wrapper.find('[data-testid="weather-state"]');
            expect(weatherElement.exists()).toBe(true);
            expect(weatherElement.text()).toContain('Tokyo');
            expect(weatherElement.text()).toContain('Japan');
            expect(weatherElement.text()).toContain('22°C');
            expect(weatherElement.text()).toContain('Sunny');
        });

        it('should format location correctly', () => {
            const mockWeather = {
                city: 'New York',
                country: 'USA',
                temperature: 15,
                condition: 'Cloudy'
            };

            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: null,
                    currentWeather: mockWeather
                }
            });

            const location = wrapper.find('.location');
            expect(location.text()).toBe('New York, USA');
        });
    });

    describe('Empty State', () => {
        it('should display empty state when no data is available', () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: null,
                    currentWeather: null
                }
            });

            const emptyElement = wrapper.find('[data-testid="empty-state"]');
            expect(emptyElement.exists()).toBe(true);
            expect(emptyElement.text()).toContain('Search for a city');
        });
    });

    describe('State Transitions', () => {
        it('should transition from empty to loading state', async () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: false,
                    error: null,
                    currentWeather: null
                }
            });

            expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);

            await wrapper.setProps({ loading: true });

            expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false);
        });

        it('should transition from loading to weather data state', async () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: true,
                    error: null,
                    currentWeather: null
                }
            });

            const mockWeather = {
                city: 'Paris',
                country: 'France',
                temperature: 18,
                condition: 'Rainy'
            };

            await wrapper.setProps({
                loading: false,
                currentWeather: mockWeather
            });

            expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false);
            expect(wrapper.find('[data-testid="weather-state"]').exists()).toBe(true);
        });

        it('should transition from loading to error state on failure', async () => {
            const wrapper = mount(WeatherDashboardComponent, {
                props: {
                    loading: true,
                    error: null,
                    currentWeather: null
                }
            });

            await wrapper.setProps({
                loading: false,
                error: 'API request failed'
            });

            expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false);
            expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true);
        });
    });
});


// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

export {
    formatDate,
    formatTime,
    formatTemperature,
    WeatherDashboardComponent
};
