import React from "react"
import ImgCrop from "antd-img-crop"
import { fileSizeCheck } from "utils/helper"

const Upload = ({
    onChange,
    children,
    maxCount = 1,
    listType = "picture",
    accept = ".jpeg, .png, .jpg, .gif",
    showUploadList,
    beforeUpload = (file) => fileSizeCheck(file, 5),
}) => {
    return (
        <ImgCrop beforeCrop={(file) => fileSizeCheck(file, 5)} cropShape={"rect"} quality={1} aspect={1.4}>
            <Upload
                accept={accept}
                maxCount={maxCount}
                listType={listType}
                beforeUpload={beforeUpload}
                showUploadList={showUploadList}
                onChange={(info) => onChange(info?.file?.originFileObj ?? null)}
            >
                {children}
            </Upload>
        </ImgCrop>
    )
}

export default Upload
