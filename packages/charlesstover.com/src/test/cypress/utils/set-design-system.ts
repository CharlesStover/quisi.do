import select from './select';

export default function setDesignSystem(name: string): void {
  beforeEach((): void => {
    cy.get('*[role="button"]').contains('Settings').click();
    select('Design system', name, {
      parentSelector: 'nav ul > li',
    });
    cy.get('body').should('not.contain.text', 'CharlesStover.com');
    cy.get('body').contains('CharlesStover.com');
  });
}
