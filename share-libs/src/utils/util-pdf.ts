import JsPDF from 'jspdf'
import html2Canvas from 'html2canvas'

/**文件打印控件类 */
export abstract class ExportPDF {
    constructor() { }
    exportPDF(title) {
        html2Canvas(document.querySelector('#reportId'), {
            allowTaint: true,
            /**清晰度，越大越清晰同事内容数据越大，生成越慢 */
            scale: 5
        }).then(function (canvas) {
            /**内容整体的宽高 */
            let contentWidth = canvas.width, contentHeight = canvas.height, context = canvas.getContext("2d")
            /**生成存储a4页面的PDF文件*/
            let PDF = new JsPDF('portrait', 'pt', 'a4');
            /**A4纸的尺寸（就是pdf页面的大小） [592.28 , 841.89] */
            let a4W = 595.28, a4H = 841.89;
            /**图像大小，保证图像不变形 (仅对单张页面有用)*/
            let imgWidth = a4W, imgHeight = imgWidth / contentWidth * contentHeight;
            /**每个页面能存放的内容高度 */
            let pageHeight = (contentWidth / a4W * a4H) + 1 | 0;
            /**未绘制进PDG的剩下的内容高度 */
            let leftHeight = contentHeight;
            if (leftHeight < pageHeight) {
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
                /**多页面时截取需要知道第几页，方便获取剩余内容 */
                let i = 0;
                /**图像大小，保证不变形*/
                let imgWidth = a4W, imgHeight = a4H;
                /**部分截图数据 (每次截取pdf高度的90%，剩余10%作为留白) */
                pageHeight = 0.9 * pageHeight;
                /**页面内容的高度 */
                let contentPageHeight = pageHeight;
                while (leftHeight > 0) {
                    /**剩余未绘制内容不足填充页面时处理 */
                    if (leftHeight < contentHeight) {
                        /**设置剩余的图片高度（防止变形） */
                        imgHeight = leftHeight / pageHeight * a4H;
                        /**剩余的内容高度就是余下高度（不处理会生成黑色内容区域）*/
                        contentPageHeight = leftHeight;
                    }
                    /**获取第i页面的内容数据 */
                    let data = context.getImageData(0, i * pageHeight, contentWidth, contentPageHeight);
                    /**将部分内容数据绘制到新的canvas中 */
                    let canvasPara = document.createElement('canvas');
                    canvasPara.width = contentWidth,
                        canvasPara.height = contentPageHeight;
                    let contextPara = canvasPara.getContext('2d');
                    contextPara.putImageData(data, 0, 0);
                    /**得到内容数据 */
                    let pageData = canvasPara.toDataURL('image/jpeg', 1.0);
                    /**留白处理 */
                    let position = i == 0 ? 0 : 0.05 * a4H;
                    /**将页面内容加如PDF */
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                    i++
                    /**剩余内容高度计算 */
                    leftHeight = contentHeight - i * pageHeight;
                    if (leftHeight > 0) {
                        /**有剩余内容需要添加页面 */
                        PDF.addPage()
                    }
                }
            }
            PDF.save(title + '.pdf')
        })
    }
}
