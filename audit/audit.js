// 每页显示的数据数量
const pageSize = 10;

// 当前页码
let currentActivityPage = 1;
let currentClubPage = 1;
let currentResultPage = 1;
let currentNoticePage = 1;
let currentBannerPage = 1;

// 总数据量（假设在服务端获取）
let totalActivityCount = 0; // 这里需要根据实际情况设置
let totalClubCount = 0; 
let totalResultCount = 0;
let totalNoticeCount = 0;
let totalBannerCount = 0;

let activityIdMap = {};
let rejectActivityIndex = 0;

let clubIdMap = {};
let rejectClubIndex = 0;

let resultIdMap = {};
let rejectResultIndex = 0;

let noticeIdMap = {};
let rejectNoticeIndex = 0;

let bannerIdMap = {};
let rejectBannerIndex = 0;

let rejectType = 0;

// 模拟从服务端获取帖子数据的函数，根据帖子类型筛选
function fetchActivityData(pageNo) {
    currentActivityPage = pageNo
    const postType = document.getElementById("postType").value;
    const activityIdInput = document.getElementById("activityId");
    const activityId = activityIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(activityId)) {
        // 在这里向服务端发送带有活动ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的活动ID");
    }
    
    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryActivity?page_no=${pageNo}&page_size=${pageSize}&audit_type=${postType}&activity_id=${activityId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                renderPostData(data);
            }else {
                alert("获取数据失败："+data.err_no+" "+data.err_msg);
            }
           
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


// 渲染帖子数据到表格
function renderPostData(activityData) {
    const postTableBody = document.getElementById("postTableBody");
  
    // 清空表格内容
    postTableBody.innerHTML = "";

    activityData.data.activity_datas.forEach((post, index) => {
        const row = document.createElement("tr");

        activityIdMap[index] = post.activity_id
   
        row.innerHTML = `
            <td>${post.activity_id}
            <td>${post.title}</td>
            <td>${post.content}</td>
            <td>${post.cover_image_url && post.cover_image_url != "" ? `<img src="${post.cover_image_url}" alt="活动封面图片" width="100"` : ''}</td>
            <td>${generateImageTags(post.image_urls)}</td>
            <td>${post.author_uid}</td>
            <td>${post.activity_location}</td>
            <td>${post.status}</td>
            <td>${post.audit_status}</td>
            <td>${post.audit_reason}</td>
            <td>
                <button onclick="approvePost(${index})">通过审核</button>
                <button onclick="rejectPost(${index})">驳回</button>
            </td>
        `;
        postTableBody.appendChild(row);
    });

    totalActivityCount = activityData.data.activity_num
    updateActivityPageInfo();
}


// 辅助函数，生成多张图片的HTML标签
function generateImageTags(imageUrls) {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageTags = imageUrls.map(imageUrl => {
            if (imageUrl !== "") {
                return `<img src="${imageUrl}" alt="活动图片" width="100">`;
            } else {
                return ''; // 不展示空字符串
            }
        });
        return imageTags.join('');
    }
    return '';
}

// 处理通过审核操作
function approvePost(activityIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let activityId = activityIdMap[activityIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(activityId)],
            "data_type":0,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                fetchActivityData(currentActivityPage);
                alert("帖子已通过审核");
            }else {
                alert("帖子审核失败失败："+data.err_no+" "+data.err_msg);
            }
           
            
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectPost(index) {
    rejectActivityIndex = index;
    rejectType = 0;
    openRejectionModal();
}


// 处理通过审核操作
function approveClub(clubIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let clubId = clubIdMap[clubIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(clubId)],
            "data_type":1,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                fetchClubData(currentClubPage);
                alert("社团已通过审核");
            }else {
                alert("社团审核失败："+data.err_no+" "+data.err_msg);
            }
            
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectClub(index) {
    rejectClubIndex = index;
    rejectType = 1;
    openRejectionModal();
}

// 在下拉菜单选择发生变化时重新获取和渲染帖子数据
function fetchAndRenderPostData() {
    const postType = document.getElementById("postType").value;
    renderPostData(postType);
}


function fetchClubData(pageNo) {
    currentClubPage = pageNo
    const clubType = document.getElementById("communityType").value;
    const clubIdInput = document.getElementById("clubId");
    const clubId = clubIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(clubId)) {
        // 在这里向服务端发送带有社团ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的活动ID");
    }

    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryClub?page_no=${pageNo}&page_size=${pageSize}&audit_type=${clubType}&club_id=${clubId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                renderCommunityData(data);
            }else {
                alert("获取社团数据失败："+data.err_no+" "+data.err_msg);
            }
            
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// 渲染社团数据到表格
function renderCommunityData(clubData) {
    
    const clubTableBody = document.getElementById("communityTableBody");
  
    // 清空表格内容
    clubTableBody.innerHTML = "";

    clubData.data.club_datas.forEach((club, index) => {
        const row = document.createElement("tr");

        clubIdMap[index] = club.club_id
   
        row.innerHTML = `
            <td>${club.club_id}
            <td>${club.club_name}</td>
            <td>${club.club_icon && club.club_icon != "" ? `<img src="${club.club_icon}" alt="活动封面图片" width="100"` : ''}</td>
            <td>${club.club_back_img && club.club_back_img != "" ? `<img src="${club.club_back_img}" alt="活动背景图片" width="100"` : ''}</td>
            <td>${club.club_summary}</td> 
            <td>${club.creator_uid}</td>
            <td>${club.location_desc}</td>
            <td>${club.club_status}</td>
            <td>${club.audit_status}</td>
            <td>${club.audit_reason}</td>
            <td>
                <button onclick="approveClub(${index})">通过审核</button>
                <button onclick="rejectClub(${index})">驳回</button>
            </td>
        `;
        clubTableBody.appendChild(row);
    });

    totalClubCount = clubData.data.club_num
    console.log(totalClubCount)
    updateClubPageInfo();
}


// 模拟从服务端获取活动成果数据的函数，根据成果类型筛选
function fetchActivityResultData(pageNo) {
    currentResultPage = pageNo
    const postType = document.getElementById("resultType").value;
    const resultIdInput = document.getElementById("resultId");
    const resultId = resultIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(resultId)) {
        // 在这里向服务端发送带有活动ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的活动成果ID");
    }
    
    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryActivityResult?page_no=${pageNo}&page_size=${pageSize}&audit_type=${postType}&activity_id=${resultId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                renderActivityResultData(data);
            }else {
                alert("获取活动数据失败："+data.err_no+" "+data.err_msg);
            }
            
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


// 渲染活动成果数据到表格
function renderActivityResultData(resultData) {
    const resultTableBody = document.getElementById("resultTableBody");
  
    // 清空表格内容
    resultTableBody.innerHTML = "";

    resultData.data.result_datas.forEach((post, index) => {
        const row = document.createElement("tr");

        resultIdMap[index] = post.result_id
   
        row.innerHTML = `
            <td>${post.result_id}
            <td>${post.activity_id}</td>
            <td>${post.context}</td>
            <td>${generateImageTags(post.img_urls)}</td>
            <td>${post.author_uid}</td>
            <td>${post.status}</td>
            <td>${post.audit_status}</td>
            <td>${post.audit_reason}</td>
            <td>
                <button onclick="approveActivityResult(${index})">通过审核</button>
                <button onclick="rejectActivityResult(${index})">驳回</button>
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    totalResultCount = resultData.data.activity_result_num
    updateActivityResultPageInfo();
}


// 处理通过审核操作
function approveActivityResult(resultIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let resultId = resultIdMap[resultIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(resultId)],
            "data_type":2,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                fetchActivityResultData(currentResultPage);
                alert("活动成果已通过审核");
            }else {
                alert("活动审核失败："+data.err_no+" "+data.err_msg);
            }
           
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectActivityResult(index) {
    rejectResultIndex = index;
    rejectType = 2;
    openRejectionModal();
}



// 辅助函数，生成多张图片的HTML标签
function generateImageTags(imageUrls) {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageTags = imageUrls.map(imageUrl => {
            if (imageUrl !== "") {
                return `<img src="${imageUrl}" alt="活动图片" width="100">`;
            } else {
                return ''; // 不展示空字符串
            }
        });
        return imageTags.join('');
    }
    return '';
}

// 处理通过审核操作
function approvePost(activityIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let activityId = activityIdMap[activityIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(activityId)],
            "data_type":0,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                fetchActivityData(currentActivityPage);
                alert("帖子已通过审核");
            }else {
                alert("帖子审核失败："+data.err_no+" "+data.err_msg);
            }
       
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectPost(index) {
    rejectActivityIndex = index;
    rejectType = 0;
    openRejectionModal();
}



// 分页按钮和信息元素
const prevButton = document.querySelector("#postTab .pagination button:first-child");
const nextButton = document.querySelector("#postTab .pagination button:last-child");
const pageInfo = document.querySelector("#postTab #pageInfo");

// 上一页按钮点击事件处理函数
function prevActivityPage() {
    if (currentActivityPage > 1) {
        currentActivityPage--;
        //fetchAndRenderPostData();
        fetchActivityData(currentActivityPage);
    }
}

// 下一页按钮点击事件处理函数
function nextActivityPage() {
    const totalPages = Math.ceil(totalActivityCount / pageSize);
    if (currentActivityPage < totalPages) {
        currentActivityPage++;
        //fetchAndRenderPostData();
        fetchActivityData(currentActivityPage);
    }
}

// 上一页按钮点击事件处理函数
function prevClubPage() {
    if (currentClubPage > 1) {
        currentClubPage--;
        //fetchAndRenderPostData();
        fetchClubData(currentClubPage);
    }
}

// 下一页按钮点击事件处理函数
function nextClubPage() {
    const totalPages = Math.ceil(totalClubCount / pageSize);
    if (currentClubPage < totalPages) {
        currentClubPage++;
        //fetchAndRenderPostData();
        fetchClubData(currentClubPage);
    }
}

// 上一页按钮点击事件处理函数
function prevActivityResultPage() {
    if (currentResultPage > 1) {
        currentResultPage--;
        //fetchAndRenderPostData();
        fetchActivityResultData(currentResultPage);
    }
}

// 下一页按钮点击事件处理函数
function nextActivityResultPage() {
    const totalPages = Math.ceil(totalResultCount / pageSize);
    if (currentResultPage < totalPages) {
        currentResultPage++;
        //fetchAndRenderPostData();
        fetchActivityResultData(currentResultPage);
    }
}


// 更新分页信息
function updateActivityPageInfo() {
    const totalPages = Math.ceil(totalActivityCount / pageSize);
    document.getElementById("pageActivityInfo").innerText=`Page ${currentActivityPage} of ${totalPages}`
}

// 更新分页信息
function updateClubPageInfo() {
    const totalPages = Math.ceil(totalClubCount / pageSize);
    document.getElementById("pageClubInfo").innerText=`Page ${currentClubPage} of ${totalPages}`
}

// 更新分页信息
function updateActivityResultPageInfo() {
    const totalPages = Math.ceil(totalResultCount / pageSize);
    document.getElementById("pageActivityResultInfo").innerText=`Page ${currentResultPage} of ${totalPages}`
}

// 在下拉菜单选择发生变化时重新获取和渲染帖子数据
function fetchAndRenderPostData() {
    // 计算起始索引
    const startIndex = (currentActivityPage - 1) * pageSize;
    // 在这里可以向服务端发送请求，获取帖子数据的子集（startIndex 到 startIndex + pageSize）
    // 并渲染到相应的内容容器（例如：#postContent）
    // 更新分页信息
    updatePageInfo();
}


// 页面加载后渲染默认帖子数据
window.onload = function () {
    openTab(event, 'postTab');
    rejectType = 0;
};


// 切换标签页的函数
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("selected"); // 移除之前选中的标签的样式
    }

    const selectedTab = document.getElementById(tabName);
    if (tabName == 'postTab') {
        rejectType = 0
    } else if (tabName == 'communityTab') {
        rejectType = 1
    } if (tabName == 'activityResultTab') {
        rejectType = 2
    }
    
    if (selectedTab) {
        selectedTab.style.display = "block";
        if (evt.currentTarget && evt.currentTarget.classList) {
            evt.currentTarget.classList.add("selected"); // 添加选中标签的样式
        }
    }
};

// 弹出模态框
function openRejectionModal() {
    const modal = document.getElementById("rejectModal");
    modal.style.display = "block";
    resetRejectionReasonForm();
}

// 关闭模态框
function closeRejectionModal() {
    const modal = document.getElementById("rejectModal");
    modal.style.display = "none";
}

// 重置驳回原因选择表单
function resetRejectionReasonForm() {
    const form = document.getElementById("rejectionReasonForm");
    form.reset();
}


// 当用户点击提交按钮时，向服务端发送请求，并关闭模态框
function rejectAudit() {
    const selectedReason = document.querySelector('input[name="rejectionReason"]:checked');
    if (selectedReason) {
        const reasonValue = selectedReason.value;
        // 在这里向服务端发送请求，使用 reasonValue 作为驳回原因
         // 在这里执行通过审核操作，可以向服务端发送请求

        if (rejectType == 0) {
            let activityId = activityIdMap[rejectActivityIndex]
            // 发送POST请求到服务端以获取查询数据
            fetch(`http://124.220.84.200:5455/platform/auditData`,{
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "data_ids":[String(activityId)],
                    "data_type":0,
                    "audit_status":-1,
                    "audit_reason":reasonValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // 渲染获取的数据
                    console.log(data)
                    if (data.err_no == 0) {
                        alert("活动已驳回");
                        fetchActivityData(currentActivityPage);
                    }else {
                        alert("驳回活动失败："+data.err_no+" "+data.err_msg);
                    }
               
                   
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("驳回出错");
                });
            console.log("提交驳回原因:", reasonValue);
            closeRejectionModal();
        } else if (rejectType == 1) {
            let clubId = clubIdMap[rejectClubIndex]
            // 发送POST请求到服务端以获取查询数据
            fetch(`http://124.220.84.200:5455/platform/auditData`,{
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "data_ids":[String(clubId)],
                    "data_type":1,
                    "audit_status":-1,
                    "audit_reason":reasonValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // 渲染获取的数据
                    console.log(data)
                    if (data.err_no == 0) {
                        alert("社团已驳回");
                        fetchClubData(currentClubPage);
                    }else {
                        alert("驳回社团失败："+data.err_no+" "+data.err_msg);
                    }
                   
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("驳回出错");
                });
            console.log("提交驳回原因:", reasonValue);
            closeRejectionModal();
        } else if (rejectType == 2) {
            let resultId = resultIdMap[rejectResultIndex]
            // 发送POST请求到服务端以获取查询数据
            fetch(`http://124.220.84.200:5455/platform/auditData`,{
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "data_ids":[String(resultId)],
                    "data_type":2,
                    "audit_status":-1,
                    "audit_reason":reasonValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // 渲染获取的数据
                    console.log(data)
                    if (data.err_no == 0) {
                        alert("活动成果已驳回");
                        fetchActivityResultData(currentResultPage);
                    }else {
                        alert("驳回活动成果失败："+data.err_no+" "+data.err_msg);
                    }
                    
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("驳回出错");
                });
            console.log("提交驳回原因:", reasonValue);
            closeRejectionModal();
        }else {
            alert("审核类型错误");
        }

    } else {
        alert("请选择一个驳回原因");
    }
}

// 发布公告
function publishPublicNotice() {
    const noticeIdInput = document.getElementById("publishNoticeId").value;
    const noticeContextInput = document.getElementById("publishNoticeContext").value;
    const noticeJumpUrlInput = document.getElementById("publishNoticeJumpUrl").value;
    const noticeStartTimeInput = document.getElementById("publishNoticeStartTime").value;
    const noticeEndTimeInput = document.getElementById("publishNoticeEndTime").value;
    const noticeStatus = document.getElementById("publishNoticeStatus").value;
    
    const noticeId = noticeIdInput.trim();
    const noticeContext = noticeContextInput.trim();
    const noticeJumpUrl = noticeJumpUrlInput.trim();
    const noticeStartTimeStr = Date.parse(noticeStartTimeInput)+ '';
    const noticeEndTimeStr = Date.parse(noticeEndTimeInput)+ '';

    const noticeStartTime = Number(noticeStartTimeStr.substring(0,noticeStartTimeStr.length-3));
    const noticeEndTime = Number(noticeEndTimeStr.substring(0,noticeEndTimeStr.length-3));
    console.log(noticeEndTime);

    if (noticeContextInput == '') {
        alert("请输入公告内容");
        return 
    }

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/public_notice/createPublicNotice`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "notice_id":noticeId,
            "notice_text":noticeContext,
            "notice_jump_url":noticeJumpUrl,
            "status":Number(noticeStatus),
            "start_time":noticeStartTime,
            "end_time":noticeEndTime,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data);
            if (data.err_no == 0) {
                alert("发布成功");
            }else {
                alert("发布失败："+data.err_no+" "+data.err_msg);
            }
      
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("发布出错");
        });
}

// 模拟从服务端获取公告数据
function fetchPublicNoticeData(pageNo) {
    currentNoticePage = pageNo
    const noticeType = document.getElementById("noticeType").value;
    const noticeIdInput = document.getElementById("noticeId");
    const noticeId = noticeIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(noticeId)) {
        // 在这里向服务端发送带有活动ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的公告ID");
    }
    
    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryPublicNotice?page_no=${pageNo}&page_size=${pageSize}&notice_type=${noticeType}&notice_id=${noticeId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                renderPublicNoticeData(data);
            }else {
                alert("获取数据失败："+data.err_no+" "+data.err_msg);
            }
           
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


// 渲染公告数据到表格
function renderPublicNoticeData(noticeData) {
    const noticeTableBody = document.getElementById("noticeTableBody");
  
    // 清空表格内容
    noticeTableBody.innerHTML = "";

    noticeData.data.notice_datas.forEach((notice, index) => {
        const row = document.createElement("tr");

        noticeIdMap[index] = notice.notice_id
   
        row.innerHTML = `
            <td>${notice.notice_id}
            <td>${notice.notice_text}</td>
            <td>${notice.notice_jump_url}</td>
            <td>${convertTimeStampToTime(notice.start_time)}</td>
            <td>${convertTimeStampToTime(notice.end_time)}</td>
            <td>${notice.status}</td>
            <td>${notice.creator_uid}</td>
            <td>${notice.creator_name}</td>
        `;
        noticeTableBody.appendChild(row);
    });

    totalNoticeCount = noticeData.data.notice_num
    updatePublicNoticePageInfo();
}

// 更新分页信息
function updatePublicNoticePageInfo() {
    const totalPages = Math.ceil(totalNoticeCount / pageSize);
    document.getElementById("pagePublicNoticeInfo").innerText=`Page ${currentNoticePage} of ${totalPages}`
}

// 上一页按钮点击事件处理函数
function prevPuliceNoticePage() {
    if (currentNoticePage > 1) {
        currentNoticePage--;
        //fetchAndRenderPostData();
        fetchPublicNoticeData(currentResultPage);
    }
}

// 下一页按钮点击事件处理函数
function nextPubliceNoticePage() {
    const totalPages = Math.ceil(totalNoticeCount / pageSize);
    if (currentNoticePage < totalPages) {
        currentNoticePage++;
        //fetchAndRenderPostData();
        fetchPublicNoticeData(currentNoticePage);
    }
}

// 发布banner
function publishBanner() {
    const bannerIdInput = document.getElementById("publishBannerId").value;
    const bannerImgUrlInput = document.getElementById("publishBannerImgUrl").value;
    const bannerJumpUrlInput = document.getElementById("publishBannerJumpUrl").value;
    const bannerStartTimeInput = document.getElementById("publishBannerStartTime").value;
    const bannerEndTimeInput = document.getElementById("publishBannerEndTime").value;
    const bannerStatus = document.getElementById("publishBannerStatus").value;
    
    const bannerId = bannerIdInput.trim();
    const bannerImgUrl = bannerImgUrlInput.trim();
    const bannerJumpUrl = bannerJumpUrlInput.trim();
    const bannerStartTimeStr = Date.parse(bannerStartTimeInput)+ '';
    const bannerEndTimeStr = Date.parse(bannerEndTimeInput)+ '';

    const bannerStartTime = Number(bannerStartTimeStr.substring(0,bannerStartTimeStr.length-3));
    const bannerEndTime = Number(bannerEndTimeStr.substring(0,bannerEndTimeStr.length-3));
    console.log(bannerEndTime);

    if (bannerImgUrlInput == '') {
        alert("请输入图片url");
        return 
    }

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/banner/createBanner`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "banner_id":bannerId,
            "banner_img_url":bannerImgUrl,
            "banner_jump_url":bannerJumpUrl,
            "status":Number(bannerStatus),
            "start_time":bannerStartTime,
            "end_time":bannerEndTime,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data);
            if (data.err_no == 0) {
                alert("发布成功");
            }else {
                alert("发布失败："+data.err_no+" "+data.err_msg);
            }
      
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("发布出错");
        });
}

// 模拟从服务端获取公告数据
function fetchBannerData(pageNo) {
    currentBannerPage = pageNo
    const bannerType = document.getElementById("bannerType").value;
    const bannerIdInput = document.getElementById("bannerId");
    const bannerId = bannerIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(bannerId)) {
        // 在这里向服务端发送带有活动ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的banner ID");
    }
    
    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryBanner?page_no=${pageNo}&page_size=${pageSize}&banner_type=${bannerType}&banner_id=${bannerId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            if (data.err_no == 0) {
                renderBannerData(data);
            }else {
                alert("获取数据失败："+data.err_no+" "+data.err_msg);
            }
           
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


// 渲染公告数据到表格
function renderBannerData(bannerData) {
    const bannerTableBody = document.getElementById("bannerTableBody");
  
    // 清空表格内容
    bannerTableBody.innerHTML = "";

    bannerData.data.banner_datas.forEach((banner, index) => {
        const row = document.createElement("tr");

        bannerIdMap[index] = banner.banner_id
   
        row.innerHTML = `
            <td>${banner.banner_id}
            <td>${banner.banner_img_url}</td>
            <td>${banner.banner_jump_url}</td>
            <td>${convertTimeStampToTime(banner.start_time)}</td>
            <td>${convertTimeStampToTime(banner.end_time)}</td>
            <td>${banner.status}</td>
            <td>${banner.creator_uid}</td>
            <td>${banner.creator_name}</td>
        `;
        bannerTableBody.appendChild(row);
    });

    totalBannerCount = bannerData.data.banner_num
    updateBannerPageInfo();
}

// 更新分页信息
function updateBannerPageInfo() {
    const totalPages = Math.ceil(totalBannerCount / pageSize);
    document.getElementById("pageBannerInfo").innerText=`Page ${currentBannerPage} of ${totalPages}`
}

// 上一页按钮点击事件处理函数
function prevPuliceBannerPage() {
    if (currentBannerPage > 1) {
        currentBannerPage--;
        //fetchAndRenderPostData();
        fetchBannerData(currentResultPage);
    }
}

// 下一页按钮点击事件处理函数
function nextPubliceBannerPage() {
    const totalPages = Math.ceil(totalBannerCount / pageSize);
    if (currentBannerPage < totalPages) {
        currentBannerPage++;
        //fetchAndRenderPostData();
        fetchBannerData(currentBannerPage);
    }
}

// 将时间戳（秒）转为年月日
function convertTimeStampToTime(timeStamp) {
    if (timeStamp == 0) {
        return '';
    }

    let date = new Date(parseInt(timeStamp) *1000);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1 <10? '0'+(date.getMonth() + 1) :date.getMonth());
    let day = (date.getDate() < 10 ? '0'+date.getDate(): date.getDate());
    let hour = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours());
    let minute = (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes());
    let second = (date.getSeconds() < 10? '0'+ date.getSeconds(): date.getSeconds());

    let GMT = year+'-'+month+'-'+ day+' '+hour+':'+minute+':'+second;
    return GMT
}

// // 当用户点击提交按钮时，向服务端发送请求，并关闭模态框
// document.getElementById("submitRejection").addEventListener("click", function() {
    
// });

