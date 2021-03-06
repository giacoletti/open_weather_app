/* eslint-disable no-undef */
describe("Weather info for user's location", () => {

  beforeEach(() => {
    cy.intercept('https://api.opencagedata.com/geocode/v1/json**', { fixture: 'openCageResponse.json' })
    cy.intercept('https://api.openweathermap.org/data/2.5/onecall**', { fixture: 'openWeatherResponse.json' })

    cy.visit("/", {
      onBeforeLoad(window) {
        const stubLocation = {
          coords: {
            latitude: 55.7842,
            longitude: 12.4518
          }
        };
        cy.stub(window.navigator.geolocation, "getCurrentPosition").callsFake(
          callback => {
            return callback(stubLocation);
          }
        );
      }
    });
  });

  it("is expected to be displayed on initial render", () => {
    cy.get("[data-cy=weather-display]").within(() => {
      cy.get("[data-cy=temp]").should("contain", "2.2°C");
      cy.get("[data-cy=location]").should("contain", "Paradise City");
      cy.get("[data-cy=description]").should("contain", "Few clouds");
    });
  });

});