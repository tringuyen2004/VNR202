
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';
import img8 from '../assets/8.png';
import img9 from '../assets/9.png';
import img10 from '../assets/10.png';
import img11 from '../assets/11.png';
import img12 from '../assets/12.png';
import img13 from '../assets/13.png';
// img1 = bìa sau mặc định
// img2 - img13 = tháng 1 đến tháng 12
const monthImages = [img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];
const backImages  = [img1, img1, img1, img1, img1, img1, img1, img1, img1, img1, img1, img1];

export const getCalendarData = (id) => {
    const numericId = parseInt(id, 10);
    const index = Math.max(0, Math.min(numericId - 1, 11));

    return {
        id: numericId,
        front: monthImages[index],
        back: backImages[index]
    };
};

export const getAllCalendars = () => {
    return Array.from({ length: 12 }, (_, i) => getCalendarData(i + 1));
};
