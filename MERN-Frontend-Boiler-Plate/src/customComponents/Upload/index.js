import React from "react"
import { Card, Flex, Image, Typography, Upload as UploadComponent } from "antd"
import ImgCrop from "antd-img-crop"
import { compileFiles, fileSizeCheck } from "utils/helper"
import "./styles.scss"

const Upload = ({
    onChange,
    children,
    listType = "picture",
    accept = ".jpeg, .png, .jpg, .gif",
    fileTypeName = "file",
    showUploadList = false,
    multiple,
    aspectRatio,
    maxFileSize = 5,
    beforeUpload = (file) => (maxFileSize > 0 ? fileSizeCheck(file, maxFileSize) : false),
}) => {
    return !aspectRatio ? (
        <RenderUploadComponent
            accept={accept}
            listType={listType}
            beforeUpload={beforeUpload}
            showUploadList={showUploadList}
            fileTypeName={fileTypeName}
            onChange={onChange}
            multiple={multiple}
        >
            {children}
        </RenderUploadComponent>
    ) : (
        <ImgCrop beforeCrop={(file) => fileSizeCheck(file, 5)} cropShape={"rect"} quality={1} aspect={aspectRatio}>
            <RenderUploadComponent
                accept={accept}
                listType={listType}
                beforeUpload={beforeUpload}
                showUploadList={showUploadList}
                fileTypeName={fileTypeName}
                onChange={onChange}
                multiple={multiple}
            >
                {children}
            </RenderUploadComponent>
        </ImgCrop>
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
}) => {
    const fetchData = async ({ file, fileList }) => {
        if (multiple) onChange(await compileFiles(fileList?.map((file) => file?.originFileObj ?? file)))
        else onChange(await compileFiles([fileList[fileList.length - 1]?.originFileObj ?? fileList[0]]))
    }
    return (
        <UploadComponent
            accept={accept}
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
