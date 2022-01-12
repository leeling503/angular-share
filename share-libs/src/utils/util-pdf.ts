import JsPDF from 'jspdf'
import html2Canvas from 'html2canvas'

/**文件打印控件类 */
export abstract class ExportPDF {
    constructor() { }

    exportPDF(title) {
        html2Canvas(document.querySelector('#reportId'), {
            allowTaint: true,
            /**清晰度，越大越清晰内容数据越大，生成越慢 */
            scale: 5
        }).then(function (canvas) {
            /**留白大小 */
            let nullSize = 0.05;
            /**内容整体宽*/
            let contentWidth = canvas.width;
            /**全部内容的高 */
            let contentHeight = canvas.height, context = canvas.getContext("2d")
            /**生成存储a4页面的PDF文件*/
            let PDF = new JsPDF('portrait', 'pt', 'a4');
            /**A4纸的尺寸（就是pdf页面的大小） [592.28 , 841.89] */
            let a4W = 595.28, a4H = 841.89;
            /**图像大小，保证图像不变形 (仅对单张页面有用)*/
            let imgWidth = a4W, imgHeight = imgWidth / contentWidth * contentHeight;
            /**每个页面能存放的内容高度(内容宽度*高宽比得到内容高度) 包括要留白的高度*/
            let pageHeight = (contentWidth / a4W * a4H) + 1 | 0;
            /**未绘制进PDG的剩下的内容高度 */
            let leftHeight = contentHeight;
            if (leftHeight <= pageHeight) {
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
                /**每页上面留白定位（第一页由页面自己留白） */
                let position = 0;
                /**已经保存了的高度 */
                let savaH = 0;
                /**每次截取的数据高度 */
                let cutHeight = (1 - nullSize) * pageHeight;
                /**图像保存的大小，保证不变形（维持比例）*/
                let imgWidth = a4W,
                    imgHeight = (1 - nullSize) * a4H;
                while (leftHeight > 0) {
                    /**剩余未绘制内容不足需要截取的数据高度时 */
                    if (leftHeight < cutHeight) {
                        /**设置剩余的图片高度（防止变形） */
                        imgHeight = leftHeight / pageHeight * a4H;
                        /**截取的内容高度就是余下高度（不处理会生成黑色内容区域）*/
                        cutHeight = leftHeight;
                    }
                    /**获取剩下的内容数据 */
                    let data = context.getImageData(0, savaH, contentWidth, cutHeight);
                    savaH += cutHeight;
                    /**将部分内容数据绘制到新的canvas中 */
                    let canvasPara = document.createElement('canvas');
                    canvasPara.width = contentWidth,
                        canvasPara.height = cutHeight;
                    let contextPara = canvasPara.getContext('2d');
                    contextPara.putImageData(data, 0, 0);
                    /**得到内容数据 */
                    let pageData = canvasPara.toDataURL('image/jpeg', 1.0);
                    /**将页面内容加入PDF */
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                    /**第二页开始上面需要进行留白处理 */
                    position = nullSize * a4H;
                    cutHeight = (1 - 2 * nullSize) * pageHeight;
                    imgHeight = (1 - 2 * nullSize) * a4H;
                    /**剩余内容高度计算 */
                    leftHeight = contentHeight - savaH;
                    if (leftHeight > 0) {
                        /**有剩余内容需要添加页面 */
                        PDF.addPage()
                    }
                }
            }
            PDF.save(title + '.pdf')
        })
    }

    async exportPDFs(title) {
        /**倍数层级 */
        let scale = 5;
        let cbFunction = (w: number, h: number, list: Uint8ClampedArray) => {
            /**记录第一次黑色占比较大的位置高度 */
            let cuth;
            /**发现了黑色高占比 */
            let flag = false;
            /**找到黑色切割点后继续向上查找Npx试图找到白色切线 */
            let conH = 10 * scale;
            /**最大的能搜寻范围 Npx*/
            let minH = h - 100 * scale;
            /**当是黑线切割，第二页也需要黑线开头，需返回黑线偏移量*/
            let offsetB = 0;
            /**整体向上偏移距离 */
            let offset = 0;
            /**最少黑色像素 */
            let perBack = Infinity, res;
            /**对每行进行数据提取 */
            for (let i = h, b = 0; i >= minH && b < conH; i = i - scale) {
                /**起始位置 */
                let start = 4 * (i - 1) * w, end = (4 * i * w) - 1;
                /**黑像素点统计计算 */
                let back = 0;
                for (let j = start; j < end;) {
                    let r = list[j], g = list[j + 1], b = list[j + 2];
                    if (!r && !g && !b) { back++ }
                    /**下一像素点 */
                    j = j + 4;
                }
                /**黑色像素点占比 */
                let percent = back / w;
                console.log('percent', percent)
                if (percent == 0) {
                    /**空白，立马切割*/
                    return { cuth: i, offset: h - i, offsetB: 0 }
                } else if (percent > 0.5) {
                    /**黑线占比较大，但需要继续向上查找尝试找到空白*/
                    /**记录第一次发现高占比的位置，切割点 */
                    cuth = flag ? cuth : i;
                    /**标记已经初次发现黑线切割点*/
                    flag = true;
                    offsetB = offsetB + scale;
                } else if (flag || b > conH) {
                    console.log(list.slice(start, end))
                    /**发现黑线占比较大后,再次出现了第一次占比较小的情况;需要保留黑色切割;但下次绘图又需要上移偏移量*/
                    offset = h - cuth;
                    return { cuth, offset, offsetB }
                } else if (back < perBack) {
                    perBack = back;
                    res = { cuth: i, offset: h - i, offsetB: 0 }
                }
                /**发现较大黑色标记或开始继续上寻指定范围，试图找寻到白色空白 */
                b = flag ? b + scale : b;
            }
            return res
        };
        html2Canvas(document.querySelector('#reportId'), {
            allowTaint: true,
            /**清晰度，越大越清晰内容数据越大，生成越慢 */
            scale: scale
        }).then(function (canvas) {
            /**留白大小 */
            let nullSize = 0.05;
            /**内容整体宽*/
            let contentWidth = canvas.width;
            /**全部内容的高 */
            let contentHeight = canvas.height, context = canvas.getContext("2d")
            /**生成存储a4页面的PDF文件*/
            let PDF = new JsPDF('portrait', 'pt', 'a4');
            /**A4纸的尺寸（就是pdf页面的大小） [592.28 , 841.89] */
            let a4W = 595.28, a4H = 841.89;
            /**图像大小，保证图像不变形 (仅对单张页面有用)*/
            let imgWidth = a4W, imgHeight = imgWidth / contentWidth * contentHeight;
            /**每个页面能存放的内容高度(内容宽度*高宽比得到内容高度) 包括要留白的高度*/
            let pageHeight = (contentWidth / a4W * a4H) + 1 | 0;
            /**未绘制进PDG的剩下的内容高度 */
            let leftHeight = contentHeight;
            if (leftHeight <= pageHeight) {
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
                /**每页上面留白定位（第一页由页面自己留白） */
                let position = 0;
                /**已经保存了的高度 */
                let savaH = 0;
                /**每次截取的数据高度 */
                let cutHeight = (1 - nullSize) * pageHeight;
                /**图像保存的大小，保证不变形（维持比例）*/
                let imgWidth = a4W,
                    imgHeight = (1 - nullSize) * a4H;
                while (leftHeight > 0) {
                    /**剩余未绘制内容不足需要截取的数据高度时 */
                    if (leftHeight < cutHeight) {
                        /**设置剩余的图片高度（防止变形） */
                        imgHeight = leftHeight / pageHeight * a4H;
                        /**截取的内容高度就是余下高度（不处理会生成黑色内容区域）*/
                        cutHeight = Math.ceil(leftHeight);
                    }
                    cutHeight = cutHeight | 0;
                    /**获取剩下的内容数据 */
                    let data = context.getImageData(0, savaH, contentWidth, cutHeight);
                    /**准备扫描内容 */
                    let h = data.height, w = data.width, rgbaList = data.data;
                    /** cuth 切线高度 ， offset 相对初始大小偏移量  offsetB 黑线高 */
                    let { cuth, offset, offsetB } = cbFunction(w, h, rgbaList);
                    console.log(cuth, offset, offsetB);
                    cutHeight = cuth;
                    imgHeight = imgHeight - (offset / scale)
                    data = context.getImageData(0, savaH, contentWidth, cutHeight);
                    savaH += (cutHeight - offsetB);
                    /**将部分内容数据绘制到新的canvas中 */
                    let canvasPara = document.createElement('canvas');
                    canvasPara.width = contentWidth,
                        canvasPara.height = cutHeight;
                    let contextPara = canvasPara.getContext('2d');
                    contextPara.putImageData(data, 0, 0);
                    /**得到内容数据 */
                    let pageData = canvasPara.toDataURL('image/jpeg', 1.0);
                    /**将页面内容加入PDF */
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                    /**第二页开始上面需要进行留白处理 */
                    position = nullSize * a4H;
                    cutHeight = (1 - 2 * nullSize) * pageHeight;
                    imgHeight = (1 - 2 * nullSize) * a4H;
                    /**剩余内容高度计算 */
                    leftHeight = contentHeight - savaH;
                    if (leftHeight > 0) {
                        /**有剩余内容需要添加页面 */
                        PDF.addPage();
                    }
                }
            }
            PDF.save(title + '.pdf')
        })
    }
}
