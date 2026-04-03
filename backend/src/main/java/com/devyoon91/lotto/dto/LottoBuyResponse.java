package com.devyoon91.lotto.dto;

import java.util.List;

public class LottoBuyResponse {
    private int autoCount;
    private int manualCount;
    private int totalCount;
    private List<LottoNumberDto> lottos;

    public LottoBuyResponse(int autoCount, int manualCount, List<LottoNumberDto> lottos) {
        this.autoCount = autoCount;
        this.manualCount = manualCount;
        this.totalCount = autoCount + manualCount;
        this.lottos = lottos;
    }

    public int getAutoCount() { return autoCount; }
    public int getManualCount() { return manualCount; }
    public int getTotalCount() { return totalCount; }
    public List<LottoNumberDto> getLottos() { return lottos; }
}
