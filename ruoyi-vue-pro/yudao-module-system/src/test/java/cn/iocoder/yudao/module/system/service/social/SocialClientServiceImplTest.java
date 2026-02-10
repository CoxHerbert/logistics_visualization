package cn.iocoder.yudao.module.system.service.social;

import cn.hutool.core.util.ReflectUtil;
import cn.iocoder.yudao.framework.common.enums.CommonStatusEnum;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.test.core.ut.BaseDbUnitTest;
import cn.iocoder.yudao.module.system.controller.admin.socail.vo.client.SocialClientPageReqVO;
import cn.iocoder.yudao.module.system.controller.admin.socail.vo.client.SocialClientSaveReqVO;
import cn.iocoder.yudao.module.system.dal.dataobject.social.SocialClientDO;
import cn.iocoder.yudao.module.system.dal.mysql.social.SocialClientMapper;
import cn.iocoder.yudao.module.system.enums.social.SocialTypeEnum;
import cn.iocoder.yudao.module.system.framework.justauth.core.AuthRequestFactory;
import me.zhyd.oauth.config.AuthConfig;
import me.zhyd.oauth.model.AuthResponse;
import me.zhyd.oauth.model.AuthUser;
import me.zhyd.oauth.request.AuthDefaultRequest;
import me.zhyd.oauth.request.AuthRequest;
import me.zhyd.oauth.utils.AuthStateUtils;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import javax.annotation.Resource;

import static cn.iocoder.yudao.framework.test.core.util.AssertUtils.assertServiceException;
import static cn.iocoder.yudao.framework.test.core.util.RandomUtils.randomLongId;
import static cn.iocoder.yudao.framework.test.core.util.RandomUtils.randomPojo;
import static cn.iocoder.yudao.framework.test.core.util.RandomUtils.randomString;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.SOCIAL_CLIENT_NOT_EXISTS;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.SOCIAL_CLIENT_UNIQUE;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.SOCIAL_USER_AUTH_FAILURE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * {@link SocialClientServiceImpl} 的单元测试
 */
@Import(SocialClientServiceImpl.class)
class SocialClientServiceImplTest extends BaseDbUnitTest {

    @Resource
    private SocialClientServiceImpl socialClientService;
    @Resource
    private SocialClientMapper socialClientMapper;

    @MockBean
    private AuthRequestFactory authRequestFactory;

    @Test
    void testGetAuthorizeUrl() {
        try (MockedStatic<AuthStateUtils> stateMock = org.mockito.Mockito.mockStatic(AuthStateUtils.class)) {
            Integer socialType = SocialTypeEnum.GITEE.getType();
            Integer userType = 1;
            AuthRequest authRequest = mock(AuthRequest.class);
            when(authRequestFactory.get(eq("GITEE"))).thenReturn(authRequest);
            stateMock.when(AuthStateUtils::createState).thenReturn("mock-state");
            when(authRequest.authorize(eq("mock-state"))).thenReturn("https://example.com/callback?redirect_uri=old");

            String url = socialClientService.getAuthorizeUrl(socialType, userType, "new-uri");
            assertEquals("https://example.com/callback?redirect_uri=new-uri", url);
        }
    }

    @Test
    void testGetAuthUser_success() {
        Integer socialType = SocialTypeEnum.GITEE.getType();
        Integer userType = 1;
        String code = randomString();
        String state = randomString();
        AuthRequest authRequest = mock(AuthRequest.class);
        when(authRequestFactory.get(eq("GITEE"))).thenReturn(authRequest);

        AuthUser authUser = randomPojo(AuthUser.class);
        AuthResponse<AuthUser> authResponse = new AuthResponse<>(2000, "ok", authUser);
        when(authRequest.login(argThat(c -> code.equals(c.getCode()) && state.equals(c.getState())))).thenReturn(authResponse);

        AuthUser result = socialClientService.getAuthUser(socialType, userType, code, state);
        assertSame(authUser, result);
    }

    @Test
    void testGetAuthUser_fail() {
        Integer socialType = SocialTypeEnum.GITEE.getType();
        Integer userType = 1;
        String code = randomString();
        String state = randomString();
        AuthRequest authRequest = mock(AuthRequest.class);
        when(authRequestFactory.get(eq("GITEE"))).thenReturn(authRequest);
        when(authRequest.login(argThat(c -> code.equals(c.getCode()) && state.equals(c.getState()))))
                .thenReturn(new AuthResponse<>(5000, "boom", null));

        assertServiceException(() -> socialClientService.getAuthUser(socialType, userType, code, state),
                SOCIAL_USER_AUTH_FAILURE, "boom");
    }

    @Test
    void testBuildAuthRequest_clientEnable_overrideConfig() {
        Integer socialType = SocialTypeEnum.GITEE.getType();
        Integer userType = 1;

        AuthRequest authRequest = mock(AuthDefaultRequest.class);
        AuthConfig config = new AuthConfig();
        config.setClientId("old-client");
        config.setClientSecret("old-secret");
        ReflectUtil.setFieldValue(authRequest, "config", config);
        when(authRequestFactory.get(eq("GITEE"))).thenReturn(authRequest);

        SocialClientDO client = randomPojo(SocialClientDO.class, o -> o.setStatus(CommonStatusEnum.ENABLE.getStatus())
                .setSocialType(socialType).setUserType(userType).setClientId("new-client").setClientSecret("new-secret"));
        socialClientMapper.insert(client);

        AuthRequest result = socialClientService.buildAuthRequest(socialType, userType);
        AuthConfig newConfig = (AuthConfig) ReflectUtil.getFieldValue(result, "config");
        assertEquals("new-client", newConfig.getClientId());
        assertEquals("new-secret", newConfig.getClientSecret());
    }

    @Test
    void testCreateUpdateDeleteSocialClient() {
        SocialClientSaveReqVO createReqVO = randomPojo(SocialClientSaveReqVO.class, o -> o.setId(null)
                .setSocialType(SocialTypeEnum.GITEE.getType()).setUserType(1));

        Long id = socialClientService.createSocialClient(createReqVO);
        assertNotNull(id);

        SocialClientSaveReqVO updateReqVO = randomPojo(SocialClientSaveReqVO.class, o -> o.setId(id)
                .setSocialType(SocialTypeEnum.GITEE.getType()).setUserType(1));
        socialClientService.updateSocialClient(updateReqVO);

        SocialClientDO socialClient = socialClientService.getSocialClient(id);
        assertNotNull(socialClient);
        assertEquals(updateReqVO.getClientId(), socialClient.getClientId());

        socialClientService.deleteSocialClient(id);
        assertNull(socialClientService.getSocialClient(id));
    }

    @Test
    void testValidateUniqueAndNotExists() {
        SocialClientDO exist = randomPojo(SocialClientDO.class, o -> o.setSocialType(SocialTypeEnum.DINGTALK.getType()).setUserType(2));
        socialClientMapper.insert(exist);

        SocialClientSaveReqVO duplicateReqVO = randomPojo(SocialClientSaveReqVO.class, o -> o.setId(null)
                .setSocialType(SocialTypeEnum.DINGTALK.getType()).setUserType(2));
        assertServiceException(() -> socialClientService.createSocialClient(duplicateReqVO), SOCIAL_CLIENT_UNIQUE);

        assertServiceException(() -> socialClientService.deleteSocialClient(randomLongId()), SOCIAL_CLIENT_NOT_EXISTS);
    }

    @Test
    void testGetSocialClientPage() {
        SocialClientDO row = randomPojo(SocialClientDO.class, o -> o.setSocialType(SocialTypeEnum.GITEE.getType()));
        socialClientMapper.insert(row);

        PageResult<SocialClientDO> pageResult = socialClientService.getSocialClientPage(new SocialClientPageReqVO());
        assertFalse(pageResult.getList().isEmpty());
    }

}
