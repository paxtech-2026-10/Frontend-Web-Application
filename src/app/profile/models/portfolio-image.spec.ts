import { PortfolioImage } from './portfolio-image';

describe('PortfolioImage', () => {
  it('should create instance with defaults', () => {
    const image = new PortfolioImage();

    expect(image).toBeTruthy();
    expect(image.id).toBe(0);
    expect(image.imageUrl).toBe('');
  });

  it('should allow assigning id and url', () => {
    const image = new PortfolioImage();

    image.id = 3;
    image.imageUrl = 'https://cdn.paxtech.com/portfolio/3.png';

    expect(image.id).toBe(3);
    expect(image.imageUrl).toBe('https://cdn.paxtech.com/portfolio/3.png');
  });
});
