import AppKit
import Foundation

struct Placement {
    let path: String
    let rect: CGRect
    var multiply: Bool = false
}

func cgImage(at path: String) -> CGImage {
    let image = NSImage(contentsOfFile: path)!
    return image.cgImage(forProposedRect: nil, context: nil, hints: nil)!
}

func drawAspectFill(_ image: CGImage, in rect: CGRect, context: CGContext) {
    let sourceRatio = CGFloat(image.width) / CGFloat(image.height)
    let targetRatio = rect.width / rect.height
    var drawRect = rect
    if sourceRatio > targetRatio {
        let width = rect.height * sourceRatio
        drawRect.origin.x -= (width - rect.width) / 2
        drawRect.size.width = width
    } else {
        let height = rect.width / sourceRatio
        drawRect.origin.y -= (height - rect.height) / 2
        drawRect.size.height = height
    }
    context.saveGState()
    context.clip(to: rect)
    context.draw(image, in: drawRect)
    context.restoreGState()
}

func makePage(basePath: String, outputPath: String, placements: [Placement]) {
    let base = cgImage(at: basePath)
    let width = base.width
    let height = base.height
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let context = CGContext(
        data: nil,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: width * 4,
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    )!

    context.setFillColor(NSColor(calibratedRed: 0.953, green: 0.937, blue: 0.902, alpha: 1).cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.setBlendMode(.multiply)
    context.draw(base, in: CGRect(x: 0, y: 0, width: width, height: height))
    context.setBlendMode(.normal)

    for placement in placements {
        let flipped = CGRect(
            x: placement.rect.origin.x,
            y: CGFloat(height) - placement.rect.origin.y - placement.rect.height,
            width: placement.rect.width,
            height: placement.rect.height
        )
        if placement.multiply {
            context.setFillColor(NSColor(calibratedRed: 0.953, green: 0.937, blue: 0.902, alpha: 1).cgColor)
            context.fill(flipped)
            context.setBlendMode(.multiply)
        }
        drawAspectFill(cgImage(at: placement.path), in: flipped, context: context)
        context.setBlendMode(.normal)
    }

    let result = context.makeImage()!
    let rep = NSBitmapImageRep(cgImage: result)
    let data = rep.representation(using: .png, properties: [:])!
    try! data.write(to: URL(fileURLWithPath: outputPath))
}

let root = CommandLine.arguments[1]
let publicRoot = root + "/frontend/public/profile"
let sourceRoot = root + "/pictures/profile"

makePage(
    basePath: publicRoot + "/profile-page-v3.png",
    outputPath: publicRoot + "/profile-page-final.png",
    placements: [
        Placement(path: sourceRoot + "/第一页/E904C336-6229-4131-8DB9-40E49DD09395.JPG", rect: CGRect(x: 78, y: 255, width: 198, height: 265)),
        Placement(path: sourceRoot + "/第一页/_ (11).jpeg", rect: CGRect(x: 300, y: 255, width: 196, height: 265), multiply: true),
    ]
)

makePage(
    basePath: publicRoot + "/what-i-shipped-v2.png",
    outputPath: publicRoot + "/what-i-shipped-final.png",
    placements: [
        Placement(path: sourceRoot + "/第二页/WechatIMG316.jpeg", rect: CGRect(x: 730, y: 66, width: 165, height: 355)),
        Placement(path: sourceRoot + "/第二页/IMG_1440.JPG", rect: CGRect(x: 927, y: 91, width: 255, height: 340)),
        Placement(path: sourceRoot + "/第二页/IMG_2228.JPG", rect: CGRect(x: 730, y: 448, width: 225, height: 300)),
        Placement(path: sourceRoot + "/第二页/Screenshot 2026-07-19 at 21.11.32.png", rect: CGRect(x: 1022, y: 445, width: 142, height: 300)),
    ]
)

makePage(
    basePath: publicRoot + "/why-i-am-here.png",
    outputPath: publicRoot + "/why-i-am-here-final.png",
    placements: [
        Placement(path: sourceRoot + "/第三页/bad4e781a150190c3d1027e8368c31.JPG", rect: CGRect(x: 893, y: 22, width: 219, height: 221)),
        Placement(path: sourceRoot + "/第三页/0a56f205a9a3f4fb725692ddbd4e39.JPG", rect: CGRect(x: 1122, y: 0, width: 250, height: 279)),
        Placement(path: sourceRoot + "/第三页/78406affe8dd643d07c628a46686a1.JPG", rect: CGRect(x: 893, y: 274, width: 208, height: 278)),
        Placement(path: sourceRoot + "/第三页/li-lanjun-Citylife.jpg", rect: CGRect(x: 1114, y: 307, width: 286, height: 374)),
    ]
)
