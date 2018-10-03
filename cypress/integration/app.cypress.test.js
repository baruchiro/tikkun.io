/* eslint-env mocha */
/* global cy,expect */

describe('app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })

  it('starts displaying text from בראשית', () => {
    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')
  })

  it('loads in the next page when scrolling down', () => {
    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000)

    cy.contains('וְאֵ֛ת כָּל־רֶ֥מֶשׂ הָֽאֲדָמָ֖ה לְמִינֵ֑הוּ וַיַּ֥רְא אֱלֹהִ֖ים כִּי־טֽוֹב׃')
  })

  it('toggles annotations when clicking on the toggle', () => {
    cy.get('[data-test-id="annotations-toggle"]').as('toggle').click()

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')

    cy.get('@toggle').click()

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')
  })

  it('opens the parsha picker when clicking on the current parsha', () => {
    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃').should('not.be.visible')

    cy.contains('נח')
    cy.contains('לך לך')
    cy.contains('וירא')
  })

  it('honors annotations toggle when dismissing the parsha picker', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click() // open parsha-picker
      .click() // and close it again

    cy.get('[data-test-id="annotations-toggle"]').click()

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')
  })

  it('hides annotations toggle and repo link when showing parsha picker', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.get('[data-test-id="annotations-toggle"]').should('not.be.visible')
    cy.get('a[href^="https://www.github.com"]').should('not.be.visible')
  })

  it('jumps to the selected parsha', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('שופטים').click()

    cy.contains('בראשית').should('not.exist')

    cy.contains('שֹׁפְטִ֣ים וְשֹֽׁטְרִ֗ים')

    cy.get('.app-toolbar').contains('ראה – שופטים')

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃').should('not.exist')
  })

  it('scrolling after jumping to another parsha should show the right content', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('שופטים').click()

    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000)

    cy.contains('הָעֹמֵ֞ד לְשָׁ֤רֶת שָׁם֙ אֶת־יְהוָ֣ה אֱלֹהֶ֔יךָ א֖וֹ אֶל־הַשֹּׁפֵ֑ט')
  })

  it('scrolling updates the current title', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('שופטים').click()

    cy.get('.app-toolbar').contains('ראה – שופטים')

    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000)

    cy.get('.app-toolbar').contains('שופטים')
  })

  it('displays the aliyot markers', () => {
    cy.contains('א:א').should('be.visible')

    cy.get('[data-test-id="annotations-toggle"]').as('toggle').click()

    cy.contains('א:א').should('be.hidden')
  })

  it('toggles annotations when the SHIFT key is pressed', () => {
    cy.get('body').as('book')

    cy.get('@book').trigger('keydown', { key: 'Shift' })

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')

    cy.get('@book').trigger('keyup', { key: 'Shift' })

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')

    cy.get('[data-test-id="annotations-toggle"]').as('toggle').click()

    cy.get('@book').trigger('keydown', { key: 'Shift' })

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')

    cy.get('@book').trigger('keyup', { key: 'Shift' })

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')
  })

  it('shows a tooltip to press the "Shift" key to toggle quickly') // can't test this because cypress does not have `cy.get('...').hover` – see https://docs.cypress.io/api/commands/hover.html#

  it('jumps to the center of the page', () => {
    const centerYOf = ({ y, height }) => y + (height / 2)

    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('נח').click()

    cy.get('[data-target-id="tikkun-book"]').then(($book) => {
      console.log($book)
      const bookRect = $book.get(0).getBoundingClientRect()

      cy.contains('אֵ֚לֶּה תּוֹלְדֹ֣ת נֹ֔חַ נֹ֗חַ אִ֥ישׁ צַדִּ֛יק תָּמִ֥ים הָיָ֖ה בְּדֹֽרֹתָ֑יו').should(($el) => {
        const rect = $el.get(0).getBoundingClientRect()
        expect(Math.abs(centerYOf(bookRect) - centerYOf(rect))).to.be.at.most(20)
      })
    })
  })

  it('shows the parsha name in place of the ראשון marker', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('וישב').click()

    cy
      .get('[data-target-id="aliyot-range"]')
      .invoke('text')
      .should('not.include', 'ראשון')

    cy
      .get('[data-target-id="aliyot-range"]')
      .invoke('text')
      .should('include', 'וישב')
  })
})