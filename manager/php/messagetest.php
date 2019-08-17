<?php  
session_start();  
header("Content-type:text/html; charset=UTF-8");  
  
function https_request($url)  
    {  
    $curl = curl_init();  
    curl_setopt($curl, CURLOPT_URL, $url);  
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);  
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);  
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);  
    $data = curl_exec($curl);  
    if (curl_errno($curl)) {return 'ERROR '.curl_error($curl);}  
    curl_close($curl);  
    return $data;  
    }  
function xml_to_array($xml){  
    $reg = "/<(\w+)[^>]*>([\\x00-\\xFF]*)<\\/\\1>/";  
    if(preg_match_all($reg, $xml, $matches)){  
        $count = count($matches[0]);  
        for($i = 0; $i < $count; $i++){  
        $subxml= $matches[2][$i];  
        $key = $matches[1][$i];  
            if(preg_match( $reg, $subxml )){  
                $arr[$key] = xml_to_array( $subxml );  
            }else{  
                $arr[$key] = $subxml;  
            }  
        }  
    }  
    return @$arr;  
}  

if(empty($mobile)){  
    //exit('手机号码不能为空');  
}  
  
if(empty($_SESSION['send_code']) or $send_code!=$_SESSION['send_code']){  
    //防用户恶意请求  
    //exit('请求超时，请刷新页面后重试');  
}  
  
function percentEncode($str)  
{  
    // 使用urlencode编码后，将"+","*","%7E"做替换即满足ECS API规定的编码规范  
    $res = urlencode($str);  
    $res = preg_replace('/\+/', '%20', $res);  
    $res = preg_replace('/\*/', '%2A', $res);  
    $res = preg_replace('/%7E/', '~', $res);  
    return $res;  
}  

function computeSignature($parameters, $accessKeySecret)  
{  
    // 将参数Key按字典顺序排序  
    ksort($parameters);  
    // 生成规范化请求字符串  
    $canonicalizedQueryString = '';  
    foreach($parameters as $key => $value)  
    {  
    $canonicalizedQueryString .= '&' . percentEncode($key)  
        . '=' . percentEncode($value);  
    }  
    // 生成用于计算签名的字符串 stringToSign  
    $stringToSign = 'GET&%2F&' . percentencode(substr($canonicalizedQueryString, 1));  
    //echo "<br>".$stringToSign."<br>";  
    // 计算签名，注意accessKeySecret后面要加上字符'&'  
    $signature = base64_encode(hash_hmac('sha1', $stringToSign, $accessKeySecret . '&', true));  
    return $signature;  
}  
// 注意使用GMT时间  
date_default_timezone_set("GMT");  
$target = "https://dysmsapi.aliyuncs.com/?";  
$dateTimeFormat = 'Y-m-d\TH:i:s\Z'; // ISO8601规范  
$accessKeyId = 'testId';      // 这里填写您的Access Key ID  
$accessKeySecret = 'testSecret';  // 这里填写您的Access Key Secret  
$ParamString="{\"customer\":\"test\"}";  

$data = array(  
    'AccessKeyId' => $accessKeyId,
    'Action' => 'SendSms',
    'Format' => 'XML', 
    'OutId' => '123', 
    'PhoneNumbers' => '15300000001',
    'RegionId' => 'cn-hangzhou',
    'SignName'=>'阿里云短信测试专用',
    'SignatureMethod' => 'HMAC-SHA1',
    'SignatureNonce'=> '45e25e9b-0a6f-4070-8c85-2956eda1b466',
    'SignatureVersion' => '1.0',
    'TemplateCode' => 'SMS_71390007', 
    'TemplateParam' => $ParamString,
    'Timestamp' => '2017-07-12T02:42:19Z',
    'Version' => '2017-05-25'
);  
// 计算签名并把签名结果加入请求参数  
//echo $data['Version']."<br>";  
//echo $data['Timestamp']."<br>";  
$data['Signature'] = computeSignature($data, $accessKeySecret);  
// 发送请求  
    $result = xml_to_array(https_request($target.http_build_query($data)));  
    echo $result['Error']['Code']."--->".$result['Error']['Message'];  
    echo "<br><br>".$target . http_build_query($data);  
?>