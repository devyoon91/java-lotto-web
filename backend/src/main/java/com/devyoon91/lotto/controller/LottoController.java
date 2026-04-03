package com.devyoon91.lotto.controller;

import com.devyoon91.lotto.domain.*;
import com.devyoon91.lotto.dto.*;
import com.devyoon91.lotto.service.LottoVendingMachine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lotto")
public class LottoController {

    @PostMapping("/buy")
    public ResponseEntity<LottoBuyResponse> buyLotto(@RequestBody LottoBuyRequest request) {
        List<String> manualNumbers = request.getManualNumbers() != null
                ? request.getManualNumbers() : new ArrayList<>();

        Lottos lottos = LottoVendingMachine.buyLottery(manualNumbers, request.getPurchaseAmount());

        List<LottoNumberDto> lottoDtos = lottos.getLottos().stream()
                .map(lotto -> new LottoNumberDto(
                        lotto.getLottoNumbers().stream()
                                .map(LottoNumber::getLottoNumber)
                                .sorted()
                                .collect(Collectors.toList()),
                        lotto.isAutoGeneration()
                ))
                .collect(Collectors.toList());

        int autoCount = (int) lottos.getLottos().stream().filter(Lotto::isAutoGeneration).count();
        int manualCount = (int) lottos.getLottos().stream().filter(l -> !l.isAutoGeneration()).count();

        return ResponseEntity.ok(new LottoBuyResponse(autoCount, manualCount, lottoDtos));
    }

    @PostMapping("/result")
    public ResponseEntity<LottoResultResponse> checkResult(@RequestBody LottoResultRequest request) {
        List<Lotto> lottoList = request.getLottos().stream()
                .map(numbers -> {
                    List<LottoNumber> lottoNumbers = numbers.stream()
                            .map(LottoNumber::of)
                            .collect(Collectors.toList());
                    return new Lotto(lottoNumbers);
                })
                .collect(Collectors.toList());

        Lottos lottos = new Lottos(lottoList);
        List<LottoResult> lottoResults = LottoVendingMachine.lottoWinningResults(
                lottos, request.getWinningNumbers(), request.getBonusNumber()
        );

        LottoWinningResults winningResults = LottoWinningStatistics.getStatistics(lottoResults);
        BigInteger profit = LottoWinningStatistics.getProfit(winningResults);

        List<WinningStatItem> stats = new ArrayList<>();
        for (LottoWinningResult wr : winningResults.getLottoWinningResults()) {
            LottoResult result = wr.getLottoResult();
            boolean bonusMatch = result == LottoResult.SECOND;
            stats.add(new WinningStatItem(result.name(), result.getWinningCount(), bonusMatch, result.getPrize(), wr.getCount()));
        }

        int purchaseAmount = request.getPurchaseAmount();
        double profitRate = purchaseAmount > 0
                ? Math.round((profit.doubleValue() / purchaseAmount) * 100) / 100.0 : 0.0;
        boolean isProfit = profitRate >= 1.0;

        return ResponseEntity.ok(new LottoResultResponse(stats, profitRate, isProfit, profit.longValue()));
    }
}
