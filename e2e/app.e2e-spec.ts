import { RecipeBookPage } from './app.po';

describe('eritis_fe App', function() {
  let page: RecipeBookPage;

  beforeEach(() => {
    page = new RecipeBookPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('rb works!');
  });
});
