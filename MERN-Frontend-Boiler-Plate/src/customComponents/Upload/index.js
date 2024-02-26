import React from "react"
import { Card, Flex, Image, Typography, Upload as UploadComponent } from "antd"
import ImgCrop from "antd-img-crop"
import { compileFiles, isFileSizeExceeded } from "utils/helper"
import "./styles.scss"

const Upload = ({
    onChange = () => null,
    children,
    listType = "picture",
    accept = ".jpeg, .png, .jpg, .gif",
    fileTypeName = "file",
    showUploadList = false,
    multiple,
    aspectRatio,
    maxFileSize = 5,
    className = "",
    beforeUpload,
}) => {
    return (
        <Flex className={className}>
            {aspectRatio && !multiple ? (
                <ImgCrop
                    beforeCrop={(file) => {
                        if (!file?.type?.includes("image/")) return false
                        if (maxFileSize > 0) return !isFileSizeExceeded(file, maxFileSize)
                        else if (typeof beforeUpload !== "function") return beforeUpload(file, false)
                    }}
                    cropShape={"rect"}
                    quality={1}
                    aspect={aspectRatio}
                    onChange={onChange}
                >
                    <RenderUploadComponent
                        accept={accept}
                        listType={listType}
                        showUploadList={showUploadList}
                        beforeUpload={(file) => {
                            if (maxFileSize > 0) return !isFileSizeExceeded(file, maxFileSize, true)
                            else if (typeof beforeUpload !== "function") return beforeUpload(file, false)
                        }}
                        fileTypeName={fileTypeName}
                        onChange={onChange}
                        maxFileSize={maxFileSize}
                    >
                        {children}
                    </RenderUploadComponent>
                </ImgCrop>
            ) : (
                <RenderUploadComponent
                    accept={accept}
                    listType={listType}
                    beforeUpload={(file) => {
                        if (maxFileSize > 0) return !isFileSizeExceeded(file, maxFileSize, true)
                        else return beforeUpload(file)
                    }}
                    showUploadList={showUploadList}
                    fileTypeName={fileTypeName}
                    onChange={onChange}
                    multiple={multiple}
                    maxFileSize={maxFileSize}
                >
                    {children}
                </RenderUploadComponent>
            )}
        </Flex>
    )
}

const RenderUploadComponent = ({
    accept,
    listType,
    beforeUpload,
    showUploadList,
    fileTypeName,
    children,
    onChange,
    multiple,
    maxFileSize,
}) => {
    const fetchData = async ({ _, fileList }) => {
        fileList = fileList?.flatMap((file) => {
            file = file?.originFileObj ?? file
            if (maxFileSize > 0 && isFileSizeExceeded(file, maxFileSize, true)) return []
            else return file
        })
        onChange(await compileFiles(multiple ? fileList : [fileList[fileList.length - 1]]))
    }
    return (
        <UploadComponent
            accept={accept}
            customRequest={({ onSuccess }) => onSuccess()}
            listType={listType}
            multiple={multiple}
            beforeUpload={beforeUpload}
            showUploadList={showUploadList}
            onChange={fetchData}
        >
            {children ? (
                children
            ) : (
                <Card className="upload-card">
                    <Flex align="center" vertical gap={"middle"}>
                        <Image className="upload-icon" preview={false} src={require("assets/images/Upload.png")} />
                        <Typography className="ant-upload-text">
                            Select a "{fileTypeName}" to Upload <br />
                            or drag & drop it here
                        </Typography>
                    </Flex>
                </Card>
            )}
        </UploadComponent>
    )
}

export default Upload
